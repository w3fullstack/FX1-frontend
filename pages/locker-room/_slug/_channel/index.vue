<template lang="pug">
.xp-locker-room-channels.row.col
  client-only
    template(v-if="!getLockerRoomIsLoading")
      XTLockerRoomSupported(v-if="isSupported && isLoggedIn")
      XTLockerRoomUnsupported(v-else)
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { mapFields } from 'vuex-map-fields'
import { mapGetters, mapActions } from 'vuex'
import map from 'lodash/map'
import { hideAll } from 'tippy.js'
import findIndex from 'lodash/findIndex'
import meta from '~/mixins/meta'

export default {
  name: 'PageLockerRoomChannels',
  components: {
    XTLockerRoomSupported: () =>
      import('~/components/templates/LockerRoom/Supported'),
    XTLockerRoomUnsupported: () =>
      import('~/components/templates/LockerRoom/Unsupported'),
  },
  mixins: [meta],
  layout: 'locker-room',
  async asyncData({ app, route, store }) {
    const notificationActive = await store.state.notification.active

    const slug = route?.params?.slug
    const slugChannel = route?.params?.channel
    const params = {
      channelSlug: route.params.channel,
      // count: 10,
    }

    const paramsCreatedAt = {
      channelSlug: route.params.channel,
      cursor:
        notificationActive?.createdAt?.toString() ||
        notificationActive?.Notification?.createdAt?.toString(),
      direction: 'up',
    }

    let chatItems

    if (notificationActive) {
      const {
        getMessagesByChannelSlugUsingCreatedAtAsCursor: { items },
      } = await app.$api.getMessagesByChannelSlugUsingCreatedAtAsCursor(
        paramsCreatedAt
      )
      chatItems = items
    } else {
      const {
        getMessagesByChannelSlug: { items },
      } = await app.$api.getMessagesByChannelSlug(params)
      chatItems = items
    }

    // async await parallel
    const [{ getChannel }, { getLockerRoom }] = await Promise.all([
      app.$api.getChannel({ slug: slugChannel }),
      app.$api.getLockerRoom({ slug }),
    ])

    const chats = []
    chats.push(...chatItems)

    const supporting = store.state.lockerRoom.supporting || []

    const active = supporting.filter((x) => {
      return x?.slug === slug
    })

    const isSupporting = !!active.length

    return {
      isSupported: isSupporting || getLockerRoom?.isSupported,
      channel: getChannel,
      lockerRoom: getLockerRoom,
      chats,
    }
  },
  data() {
    return {
      socket: null,
      myEmitErrors: {},
      channel: null,
      oldChannel: null,
      isSupported: true,
      lockerRoom: null,
      chats: [],
      usersTyping: [],
    }
  },
  computed: {
    ...mapFields('locker-room', ['lockerRoomActive', 'lockerRoomReply']),
    ...mapFields('user', ['userID', 'userName', 'userAvatar']),
    ...mapFields('channels', ['channelActive']),
    ...mapFields('app', ['showLoader']),
    ...mapGetters({
      getMediaFilesLocal: 'media/getMediaFilesLocal',
      getLockerRoomIsLoading: 'lockerRoom/getLockerRoomIsLoading',
      selectedGif: 'giphy/getSelectedGif',
    }),
  },
  watch: {
    selectedGif() {
      if (this.selectedGif && this.userID) {
        this.fnSendMessage(null, this.lockerRoomReply)
        this.$store.dispatch('locker-room/setLockerRoomReply', null)
      }
    },
    lockerRoomActive: {
      deep: true,
      handler(value) {
        this.isSupported = this.isSupported || value?.isSupported
      },
    },
    $route: {
      deep: true,
      immediate: true,
      handler() {
        this.$root.$emit('evtRtCancelEdit')
        this.clearChatDeleted()
      },
    },
  },
  async created() {
    await this.$store.dispatch(
      'locker-room/setLockerRoomActive',
      this.lockerRoom
    )
    this.lockerRoomReply = null
    const { Club, League, FanGroup, Sports } = this.lockerRoomActive || {}
    this.metaTitle = `${this.channel?.name} | ${
      League?.name || Club?.name || FanGroup?.name
    } | ${Sports[0]?.name} - FX1`
  },
  mounted() {
    this.socket = this.$nuxtSocket({
      channel: '/',
      auth: {
        token: this.$store.state.auth.token || null,
        type: 'desktop',
      },
      transports: ['websocket'],
    })

    this.$root.$on(
      'evtRtSendMessage',
      (message, reply, media, mentionsUserIDs) => {
        this.fnSendMessage(message, reply, media, mentionsUserIDs)
      }
    )

    this.$root.$on('evtRtEditMessage', (data) => {
      this.fnEditMessage(data)
    })

    this.$root.$on('evtRtDeleteMessage', (data) => {
      this.fnDeleteMessage(data)
    })

    this.fnConnectToChannel()

    // RECEIVED MESSAGE
    this.socket.on('on-message', (data) => {
      this.chats.push(data.chat)
    })

    // EDIT MESSAGE
    this.socket.on('on-edit-message', (data) => {
      if (!data.chat) return
      map(this.chats, function (chat) {
        if (chat.chatID === data.chat.chatID) {
          chat.text = data.chat.text
          chat.isEdited = true
        }
      })
    })

    // DELETE MESSAGE
    this.socket.on('on-delete-message', (data) => {
      if (!data.chat) return
      const index = findIndex(this.chats, { chatID: data.chat.chatID })

      if (data?.chat?.isDeletedEveryone) {
        this.chats.splice(index, 1)
        this.fnDeleteReply({
          chatID: data.chat.chatID,
          deleteForSelf: false,
          deleteForEveryone: true,
        })
      }
    })

    // TYPING MESSAGE
    this.socket.on('on-typing-message-v2', (data) => {
      this.usersTyping = data
        .filter(({ username, channelSlug }) => username && channelSlug === this.channelActive.slug)
        .map(({ username }) => username)
    })

    // SERVER LOGS
    this.socket.on('logs', (data) => {
      console.log('SERVERLOGS', data)
    })

    this.clearLockerRoomDeletedManagers()

    this.$root.$on('evtRtGetChannel', () => {
      this.fnGetChannel()
    })

    this.channelActive = this.channel

    this.$root.$on('evtRtIsTyping', (user) => {
      this.fnTypingMessage({ userName: user.userName, status: true })
    })

    this.$root.$on('evtRtDoneTyping', (user) => {
      this.fnTypingMessage({ userName: user.userName, status: false })
    })

    this.fnRetrieveIsSupported()
  },
  beforeDestroy() {
    if (this.oldChannel) {
      this.$root.$emit('evtReloadLockerRoom', this.oldChannel)
    }
    this.$root.$off('evtRtSendMessage')
  },
  methods: {
    ...mapActions({
      clearLockerRoomDeletedManagers:
        'locker-room/clearLockerRoomDeletedManagers',
      clearChatDeleted: 'chats/clearChatDeleted',
      setLockerRoomIsLoading: 'lockerRoom/setLockerRoomIsLoading',
      clearSelectedGift: 'giphy/clearSelectedGif',
    }),
    async fnSendMessage(message, reply, media, mentionsUserIDs) {
      try {
        const chat = {
          User: {
            username: this.userName || 'FX1 User',
            Avatar: this.userAvatar,
            id: this.userID,
          },
          chatID: uuidv4(),
          text: message,
          channelSlug: this.$route.params.channel,
          lockerRoomSlug: this.$route.params.slug,
          repliedTo: reply
            ? {
                User: {
                  username: reply?.name,
                  id: reply?.userID,
                },
                text: reply?.text,
                chatID: reply?.chatID,
                Media: reply?.Media,
              }
            : null,
          Media: media?.length ? media : null,
          MentionedUserIDs: mentionsUserIDs,
          gif: this.selectedGif,
        }
        await this.socket.emit('send-message', chat, () => {
        })

        chat.localMedia = this.getMediaFilesLocal || null
        chat.replyLocalMedia = reply?.localMedia || null

        hideAll()
        this.chats.push(chat)

        const lockerRoom = this.lockerRoomActive
        const channel = this.channelActive
        this.$mixpanelClient.trackSendMessage({
          channel,
          lockerRoom,
          reply,
        })

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
    async fnEditMessage({ chatID, text, repliedToChatID, Media }) {
      await this.socket.emit(
        'edit-message',
        {
          channelSlug: this.$route.params.channel,
          chatID,
          text,
          repliedToChatID,
          Media,
        },
        () => {
        }
      )
    },
    async fnDeleteMessage({ chatID, deleteForSelf, deleteForEveryone }) {
      await this.socket.emit(
        'delete-message',
        {
          channelSlug: this.$route.params.channel,
          chatID,
          isDeletedSelf: deleteForSelf,
          isDeletedEveryone: deleteForEveryone,
        },
        () => {
          this.fnDeleteReply({ chatID, deleteForSelf, deleteForEveryone })
        }
      )
    },
    fnConnectToChannel() {
      this.oldChannel = this.$route.params.channel || null
      if (this.oldChannel) {
        this.$root.$emit('evtReloadLockerRoom', this.oldChannel)
      }
      this.socket.emit(
        'join-channel',
        {
          channelSlug: this.$route.params.channel,
        },
        async () => {
          try {
            const lockerRoom = this.lockerRoomActive
            const channel = this.channelActive
            const params = {
              lockerRoom,
              channel,
              pageName: 'Locker room channel',
              isLoggedIn: this.isLoggedIn,
            }
            this.$mixpanelClient.trackViewPage(params)

            const {
              getNotifications: { items },
            } = await this.$api.getNotifications({
              isRead: false,
            })

            const notification = items.filter(
              (n) => n.channelSlug === this.$route.params.channel
            )
            const notificationIDs = notification.map((n) => n.id)

            await this.$api.readNotification({ notificationIDs })

            this.$store.dispatch(
              'notification/clearActiveChannelNotification',
              this.$route.params.channel
            )
            this.reloadUnreadChats()
          } catch (error) {
            this.$toast.error(error.message, {
              duration: 5000,
              position: 'bottom-left',
              className: 'fx1-error',
              iconPack: 'mdi',
              icon: 'alert-circle-outline',
            })
          }
        }
      )
    },
    async fnGetChannel() {
      const slug = this.$route.params?.channel
      const { getChannel } = await this.$api.getChannel({ slug })
      this.channel = getChannel
    },
    async fnRetrievePageDetails() {
      const slug = this.$route?.params?.slug
      const slugChannel = this.$route?.params?.channel
      const params = {
        channelSlug: this.$route.params.channel,
      }

      // async await parallel
      const [
        {
          getMessagesByChannelSlug: { items },
        },
        { getChannel },
        { getLockerRoom },
      ] = await Promise.all([
        this.$api.getMessagesByChannelSlug(params),
        this.$api.getChannel({ slug: slugChannel }),
        this.$api.getLockerRoom({ slug }),
      ])

      const chats = []
      chats.push(...items)

      this.isSupported = getLockerRoom?.isSupported
      this.channel = getChannel
      this.lockerRoom = getLockerRoom
      this.chats = chats
    },
    fnDeleteReply({ chatID, deleteForEveryone, deleteForSelf }) {
      map(this.chats, function (data) {
        if (data.repliedTo?.chatID === chatID) {
          data.repliedTo = {
            ...{
              isDeletedEveryone: deleteForEveryone,
              isDeletedSelf: deleteForSelf,
            },
            ...data.repliedTo,
          }
        }
      })
    },
    fnTypingMessage({ userName, status }) {
      this.socket.emit(
        'typing-message-v2',
        { channelSlug: this.$route.params.channel, userName, isTyping: status },
      )
    },
    async reloadUnreadChats() {
      if (!this.isLoggedIn) return
      const {
        Me: { Supporting },
      } = await this.$api.getMyProfileSupporting()

      if (!Supporting) return
      const initialCount = []
      await Supporting?.map((data) => {
        return initialCount.push({
          slug: data.slug,
          totalUnreadMessagesCount: data.totalUnreadMessagesCount,
        })
      })
      await this.$store.dispatch(
        'notification/setLockerRoomCount',
        initialCount
      )
    },
    async fnRetrieveIsSupported() {
      try {
        const {
          getLockerRoom: { isSupported },
        } = await this.$api.getLockerRoomIsSupported({
          slug: this.$route.params?.slug,
        })

        this.isSupported = isSupported
      } catch (error) {
      } finally {
        this.setLockerRoomIsLoading(false)
      }
    },
  },
}
</script>
