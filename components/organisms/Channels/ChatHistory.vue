<template lang="pug">
.xo-channel-chat-history.flex-column(@contextmenu.prevent="")
  infinite-loading(
    direction="top",
    :distance="300",
    @infinite="fnRetrieveNextChats",
    v-if="(chats.length >= 10 && showInfiniteLoading) || !filteredLocalChats.length"
  )
    div(slot="spinner"): XAChannelsChatLoader
    div(slot="no-more")
    div(slot="no-results")
  XMChannelsChatItem(
    v-for="(addedChat, index) in filteredAddedChats",
    :key="`${index}-added-chat`",
    :chat="addedChat",
    :scroll-to-bottom="false"
  )
  XMChannelsChatItem(
    v-for="(chat, index) in filteredLocalChats",
    :key="`${index}-chat`",
    :chat="chat",
    :is-last="index === filteredLocalChats.length - 1"
  )
  XAChannelsTyping(:users-typing="usersTyping")
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapGetters } from 'vuex'
import { decryptChannelKey, decryptMessage } from '~/scripts/messages'

export default {
  name: 'XOChannelsChatHistory',
  components: {
    XMChannelsChatItem: () =>
      import('~/components/molecules/Channels/ChatItem'),
    XAChannelsChatLoader: () =>
      import('~/components/atoms/Channels/ChatLoader'),
    XAChannelsTyping: () => import('~/components/atoms/Channels/Typing'),
  },
  props: {
    cursored: {
      type: Boolean,
      required: false,
      default: true,
    },
    channel: {
      type: Object,
      required: false,
      default: () => {},
    },
    isEncrypted: {
      type: Boolean,
      required: false,
      default: false,
    },
    chats: { type: Array, default: () => [] },
    showInfiniteLoading: { type: Boolean, default: false },
    usersTyping: { type: Array, default: () => [] },
  },
  data() {
    return {
      cursor: 10,
      addedChats: [],
      localChats: this.chats || [],
    }
  },
  computed: {
    ...mapFields('messages', ['messageNext']),
    ...mapFields('user', ['userID', 'encryptionKey']),
    ...mapGetters({
      getChatDeletedForEveryone: 'chats/getChatDeletedForEveryone',
      getChatDeletedForSelf: 'chats/getChatDeletedForSelf',
    }),
    filteredLocalChats() {
      const deletedEveryoneChats = this.localChats.filter((x) => {
        return (
          !x?.isDeletedEveryone &&
          !this.getChatDeletedForEveryone.includes(x?.chatID)
        )
      })

      const deletedSelfChats = deletedEveryoneChats.filter((x) => {
        if (x?.User?.id === this.userID) {
          return (
            !x?.isDeletedSelf && !this.getChatDeletedForSelf.includes(x?.chatID)
          )
        }

        return x
      })

      return deletedSelfChats
    },
    filteredAddedChats() {
      const deletedEveryoneChats = this.addedChats.filter((x) => {
        return (
          !x?.isDeletedEveryone &&
          !this.getChatDeletedForEveryone.includes(x?.chatID)
        )
      })

      const deletedSelfChats = deletedEveryoneChats.filter((x) => {
        if (x?.User?.id === this.userID) {
          return (
            !x?.isDeletedSelf && !this.getChatDeletedForSelf.includes(x?.chatID)
          )
        }

        return x
      })

      return deletedSelfChats
    },
  },
  mounted() {
    this.$root.$on('evtRtUpdateChatList', (chat) => {
      const indexLocalChats = this.localChats.findIndex((x) => {
        return x?.chatID === chat?.chatID
      })

      const indexAddedChats = this.addedChats.findIndex((x) => {
        return x?.chatID === chat?.chatID
      })

      if (this.localChats[indexLocalChats]) {
        this.localChats[indexLocalChats].text = chat?.text
        this.localChats[indexLocalChats].isEdited = chat?.isEdited
      }

      if (this.addedChats[indexAddedChats]) {
        this.addedChats[indexAddedChats].text = chat?.text
        this.addedChats[indexAddedChats].isEdited = chat?.isEdited
      }
    })
  },
  methods: {
    async fnRetrieveNextChats($state) {
      try {
        const params = {
          channelSlug: this.$route.params.channel,
          count: 10,
          cursor: this.cursored ? this.cursor : 0,
        }
        const {
          getMessagesByChannelSlug: { items, next },
        } = await this.$api.getMessagesByChannelSlug(params)

        this.cursor = next

        const decryptedChannelKey = this.isEncrypted && decryptChannelKey(this.channel.EncryptionKey, this.encryptionKey)

        if (items.length) {
          const decryptedMessages = items.map((m) => {
            if (this.isEncrypted) {
              if (m.text) {
                m.text = decryptMessage(decryptedChannelKey, m.text)
              }

              if (m.RepliedTo?.text) {
                m.RepliedTo.text = decryptMessage(decryptedChannelKey, m.RepliedTo.text)
              }
            }

            return m
          })

          if (this.filteredLocalChats.length) {
            this.addedChats.unshift(...decryptedMessages)
          } else {
            this.localChats.unshift(...decryptedMessages)
          }
          $state?.loaded()
          return
        }
        $state?.complete()
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
  },
}
</script>

<style lang="scss" scoped>
.xo-channel-chat-history::v-deep {
  padding: 30px 30px 0px;
  min-height: 100%;

  @include max-width(767px) {
    padding: 30px 30px 0px 10px;
  }

  .infinite-loading-container {
    margin-bottom: 20px;
  }
}
</style>
