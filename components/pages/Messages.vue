<template lang="pug">
.xp-messages(:class="{ 'mobile-chat': activeChannel }")
  .channels
    .search
      XAMessagesSearch(:value.sync="search")

    .channels-list
      XALoader(v-if="isLoading", :size="48")
      p.no-channels(v-else-if="channels.length === 0")
        | You don’t have any conversations.
        | Start with creating a new one by clicking + button at the top.

      XAChannelListItem(
        v-for="channel in channels",
        :key="channel.id",
        v-bind="channel",
        :active="activeChannel === channel",
        @click="setChannel(channel)"
      )
    .channels-footer
      button.start(@click="fnHandleCreatePrivateGroup", type="button")
        nuxt-img.icon(src="/v2/Messages/plus.svg")
        span Start messaging
  nuxt-child(
    :channel="activeChannel",
    :channelMessages="channelMessages",
    :usersTyping="usersTyping",
    @unsetChannel="unsetChannel"
  )
</template>

<script>
import debounce from 'lodash/debounce'
import sample from 'lodash/sample'
import { v4 as uuidv4 } from 'uuid'
import { mapFields } from 'vuex-map-fields'
import { mapActions, mapGetters } from 'vuex'
import {
  decryptChannelKey,
  encryptMessage,
  decryptMessage,
} from '~/scripts/messages'
import dialogs from '~/mixins/dialogs'
import XAMessagesSearch from '~/components/atoms/Messages/Search.vue'
import XAChannelListItem from '~/components/atoms/Messages/ChannelListItem.vue'
import XAChannelBar from '~/components/atoms/Messages/ChannelBar.vue'
import XAChat from '~/components/atoms/Messages/Chat.vue'
import XASendMessage from '~/components/atoms/Messages/XASendMessage.vue'
import XALoader from '~/components/atoms/Loader.vue'

const allowedAvatarColors = [
  {
    background: '#FFAF23',
    text: '#08252C',
  },
  {
    background: '#886BF2',
    text: '#FFFFFF',
  },
  {
    background: '#F85454',
    text: '#FFFFFF',
  },
  {
    background: '#0C353E',
    text: '#FFAF23',
  },
]

export default {
  name: 'XPMessages',
  components: {
    XAMessagesSearch,
    XAChannelListItem,
    XAChannelBar,
    XAChat,
    XASendMessage,
    XALoader,
  },
  mixins: [dialogs],
  data() {
    return {
      socket: null,
      isLoading: true,
      myId: '',
      channelsData: [],
      search: '',
      channelMessages: [],
      usersTyping: [],
    }
  },
  computed: {
    ...mapFields('user', ['userID', 'userName', 'userAvatar', 'encryptionKey']),
    ...mapFields('locker-room', ['lockerRoomReply']),
    ...mapGetters({
      getAuthToken: 'auth/getAuthToken',
      selectedGif: 'giphy/getSelectedGif',
      getMediaFilesLocal: 'media/getMediaFilesLocal',
    }),
    filteredChannels() {
      if (!this.search) {
        return this.channels
      }

      const searchValue = this.search.toLowerCase()
      return this.channels.filter((channel) =>
        channel.name.toLowerCase().includes(searchValue)
      )
    },
    channels() {
      return this.encryptionKey
        ? this.channelsData
            .map((channel) => {
              const { id, slug, name, EncryptionKey } = channel

              const decryptedChannelKey = decryptChannelKey(
                EncryptionKey,
                this.encryptionKey
              )
              const decryptedLastMessage =
                channel.LastMessage?.text &&
                decryptMessage(decryptedChannelKey, channel.LastMessage?.text)

              return {
                id,
                slug,
                name,
                iconUrl: channel.ChannelPhoto?.PhotoURL,
                objectID: channel.ChannelPhoto?.objectID,
                channelColor: sample(allowedAvatarColors),
                sentAt: channel.LastMessage?.createdAt,
                sender:
                  channel.LastMessage?.User.id === this.myId
                    ? 'Me'
                    : channel.LastMessage?.User.username,
                message: decryptedLastMessage,
                joiners: channel.Roles?.Joiners,
                isEncrypted: channel.LastMessage?.isEncrypted,
                EncryptionKey,
                isOwner: channel.Roles.Owners.some(
                  ({ User }) => User.id === this.myId
                ),
              }
            })
            .reverse()
        : []
    },
    activeChannel() {
      const { channel: channelSlug } = this.$route.params
      if (!channelSlug) return {}
      return this.channels.find((channel) => channel.slug === channelSlug) || {}
    },
  },
  watch: {
    activeChannel(newActiveChannel, oldActiveChannel) {
      if (Object.keys(oldActiveChannel).length) {
        this.$root.$emit('envRtLeaveFromChannel', oldActiveChannel)
      }

      if (Object.keys(newActiveChannel).length) {
        this.$root.$emit('envRtConnectToChannel', newActiveChannel)
      }
    },
    search() {
      this.getChannels()
    },
    selectedGif() {
      if (this.selectedGif && this.userID) {
        this.fnSendMessage(null, this.lockerRoomReply)
        this.$store.dispatch('locker-room/setLockerRoomReply', null)
      }
    },
  },
  created() {
    const { action, group, name } = this.$route.query

    if (action === 'priInvite' && group) {
      this.fnInviteMessagesDialog(
        {
          group,
          name,
        },
        async () => {
          await this.$root.$emit('evtRtRetrievEncryptedChannels')

          this.$router.replace({
            query: null,
          })
        }
      )
    }
  },
  async mounted() {
    try {
      this.socket = this.$nuxtSocket({
        channel: '/',
        auth: {
          token: this.getAuthToken || null,
          type: 'desktop',
        },
        transports: ['websocket'],
      })

      this.socket.on('on-message', (data) => {
        try {
          const { chat } = data

          if (chat.channelSlug === this.activeChannel.slug) {
            const decryptedChannelKey = decryptChannelKey(
              this.activeChannel.EncryptionKey,
              this.encryptionKey
            )

            if (chat.text) {
              chat.text = decryptMessage(decryptedChannelKey, chat.text)
            }

            if (chat.repliedTo?.text) {
              chat.repliedTo.text = decryptMessage(decryptedChannelKey, chat.repliedTo.text)
            }

            this.channelMessages.push(chat)
          }
        } catch (error) {
          this.$toast.error(error.message, {
            duration: 5000,
            position: 'bottom-left',
            className: 'fx1-error',
            iconPack: 'mdi',
            icon: 'alert-circle-outline',
          })
        }
      })

      this.socket.on('on-typing-message-v2', (data) => {
        this.usersTyping = data
          .filter(({ username, channelSlug }) => username && channelSlug === this.activeChannel.slug)
          .map(({ username }) => username)
      })

      this.socket.on('status-online', (data) => {
        this.setOnlineMembers(data)
      })

      this.$root.$on('envRtConnectToChannel', ({ slug }) => {
        this.socket.emit('join-channel', {
          channelSlug: slug,
        })
      })

      this.$root.$on('envRtLeaveFromChannel', ({ slug }) => {
        this.socket.emit('leave-channel', {
          channelSlug: slug,
        })
      })

      this.$root.$on('evtRtRetrievEncryptedChannels', async () => {
        const { JoinedPrivateEncryptedChannels } =
          await this.fnGetPrivateEncryptedChannels()
        this.channelsData = JoinedPrivateEncryptedChannels
      })

      this.$root.$on(
        'evtRtSendMessage',
        async (message, reply, media, mentionsUserIDs) => {
          await this.fnSendMessage(message, reply, media, mentionsUserIDs)
        }
      )

      this.$root.$on('evtRtIsTyping', (user) => {
        this.fnTypingMessage({
          userName: user.userName,
          status: true,
        })
      })

      this.$root.$on('evtRtDoneTyping', (user) => {
        this.fnTypingMessage({
          userName: user.userName,
          status: false
        })
      })

      this.$root.$on('evtRtScrollToBottom', () => {
        this.fnScrollToBottom()
      })

      await this.$root.$emit('evtRtRetrievEncryptedChannels')
    } catch (error) {
      this.$toast.error(error.message, {
        duration: 5000,
        position: 'bottom-left',
        className: 'fx1-error',
        iconPack: 'mdi',
        icon: 'alert-circle-outline',
      })
    }
  },
  beforeDestroy() {
    this.$root.$off('evtRtRetrievEncryptedChannels')
    this.$root.$off('evtRtSendMessage')
    this.$root.$off('evtRtScrollToBottom')
  },
  methods: {
    ...mapActions({
      setOnlineMembers: 'app/setOnlineMembers',
      clearSelectedGift: 'giphy/clearSelectedGif',
    }),
    async fnGetPrivateEncryptedChannels(params) {
      try {
        this.isLoading = true

        const {
          Me: { id: myId, JoinedPrivateEncryptedChannels },
        } = await this.$api.getJoinedPrivateEncryptedChannels(params)

        return {
          myId,
          JoinedPrivateEncryptedChannels,
        }
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    },
    getChannels: debounce(async function () {
      const { myId, JoinedPrivateEncryptedChannels } =
        await this.fnGetPrivateEncryptedChannels({
          search: this.search,
        })

      if (!this.myId) {
        this.myId = myId
      }

      this.channelsData = JoinedPrivateEncryptedChannels
    }, 500),
    setChannel(channel) {
      this.channelMessages = []

      this.$router.replace({ path: `/messages/${channel.slug}` })
    },
    unsetChannel(refresh) {
      this.$router.replace({ path: '/messages' })

      if (refresh) {
        this.getChannels()
      }
    },
    fnHandleCreatePrivateGroup() {
      this.fnCreatePrivateGroupDialog({}, async ({ objectID }) => {
        try {
          this.isLoading = true

          const findExistedChannel = this.channels.find(
            (c) => c.id === objectID
          )

          if (findExistedChannel) {
            this.activeChannel = findExistedChannel

            this.setChannel(findExistedChannel)
          } else {
            const { JoinedPrivateEncryptedChannels } =
              await this.fnGetPrivateEncryptedChannels()

            this.channelsData = JoinedPrivateEncryptedChannels
            const findChannel = this.channels.find((c) => c.id === objectID)

            this.setChannel(findChannel)
          }
        } catch (error) {
          this.$toast.error(error.message, {
            duration: 5000,
            position: 'bottom-left',
            className: 'fx1-error',
            iconPack: 'mdi',
            icon: 'alert-circle-outline',
          })
        } finally {
          this.isLoading = false
        }
      })
    },
    async fnSendMessage(message, reply, media, mentionsUserIDs) {
      try {
        const decryptedChannelKey = decryptChannelKey(
          this.activeChannel.EncryptionKey,
          this.encryptionKey
        )
        const encryptedMessage =
          message && encryptMessage(decryptedChannelKey, message)
        const encryptedReplyMessage =
          reply?.text && encryptMessage(decryptedChannelKey, reply.text)

        const chat = {
          User: {
            username: this.userName || 'FX1 User',
            Avatar: this.userAvatar,
            id: this.userID,
          },
          chatID: uuidv4(),
          text: encryptedMessage,
          channelSlug: this.$route.params.channel,
          repliedTo: reply
            ? {
                User: {
                  username: reply?.name,
                  id: reply?.userID,
                },
                gif: reply?.gif,
                text: encryptedReplyMessage,
                chatID: reply?.chatID,
                Media: reply?.Media,
              }
            : null,
          Media: media?.length ? media : null,
          MentionedUserIDs: mentionsUserIDs,
          gif: this.selectedGif,
        }
        console.log(chat, '<---')
        await this.socket.emit('send-message', chat, () => {})

        chat.localMedia = this.getMediaFilesLocal || null
        chat.replyLocalMedia = reply?.localMedia || null

        chat.text = message

        if (chat.repliedTo?.text) {
          chat.repliedTo.text = reply?.text
        }

        this.channelMessages.push(chat)

        this.$nextTick(() => {
          this.$root.$emit('evtRtScrollToBottom')
        })

        await this.clearSelectedGift()
      } catch (error) {
      } finally {
        const input = document.querySelector('.chat-input')

        input?.focus()
      }
    },
    fnTypingMessage({ userName, status }) {
      this.socket.emit(
        'typing-message-v2',
        {
          channelSlug: this.activeChannel.slug,
          userName,
          isTyping: status,
        },
      )
    },
    fnScrollToBottom: debounce(function (behavior = 'auto', block = 'end') {
      if (behavior & block) {
        const element = document.querySelector('.xa-channels-typing')

        this.$nextTick(() => {
          element?.scrollIntoView({ behavior, block })
        })

        return
      }

      const wrapper = document.querySelector('.xa-messages-chat')

      if (wrapper) {
        wrapper.scrollTo({
          top: wrapper.scrollHeight,
          behavior: 'smooth',
        })
      }
    }, 200),
  },
}
</script>

<style lang="scss" scoped>
.xp-messages {
  width: 100%;
  display: grid;
  grid-template-areas: 'channels chat';
  grid-template-columns: 380px 1fr;

  @include max-width(427px) {
    grid-template-columns: 1fr;
    &.mobile-chat {
      height: calc(var(--vh, 1vh) * 100);
      grid-template-areas: 'chat';
      > .channels {
        display: none;
      }
    }
    &:not(.mobile-chat) {
      grid-template-areas: 'channels';
      > .chat {
        display: none;
      }
    }
  }

  .channels {
    grid-area: channels;
    display: grid;
    grid-auto-rows: auto 1fr auto;
    background-color: $secondary_c;
    height: calc(var(--vh, 1vh) * 100 - 80px);
    @include max-width(767px) {
      height: calc(var(--vh, 1vh) * 100 - 58px);
    }

    @include max-width(427px) {
      height: calc(var(--vh, 1vh) * 100);
    }
    .search {
      padding: 20px 16px;
    }
    .channels-list {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding-inline: 8px;
      border-right: 1px solid #0c353e;
      overflow-y: auto;
      .no-channels {
        margin-block: auto;
        padding: 12px 20px;
        border-radius: 8px;
        background-color: $secondary;
        font-size: 16px;
        font-weight: 300;
        line-height: 1.5;
      }
      &::-webkit-scrollbar {
        width: 4px;
        background-color: $tertiary;
        border-radius: 10px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: $dark-electric-blue;
        border-radius: 10px;
      }
    }

    .channels-footer {
      padding: 20px 16px;
    }

    .start {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      cursor: pointer;

      border: 1px solid #fff;
      color: #fff;
      background-color: transparent;
      border-radius: 5px;
      padding: 12px 32px;

      font-size: 14px;
      font-weight: 500;
      line-height: 1.28;
      letter-spacing: 0.8px;
      text-transform: uppercase;

      .icon {
        display: inline-block;
      }
    }
  }

  .chat {
    grid-area: chat;
    display: grid;
    place-content: center;
    background-color: $secondary_b;

    grid-template-rows: 60px 1fr minmax(60px, auto);
    grid-template-columns: 1fr;
    grid-template-areas:
      'bar'
      'chat'
      'input';

    .blank {
      grid-area: chat;
      margin: auto;
      display: inline-block;
      padding: 12px 20px;
      background-color: $secondary;
      border-radius: 8px;
      font-size: 16px;
    }
  }
}
</style>
