<template lang="pug">
XPMention(:notification-with-messages="notificationWithMessages")
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import XPMention from '~/components/pages/Mentions/Mention.vue'
import meta from '~/mixins/meta'

export default {
  components: { XPMention },
  mixins: [meta],
  layout: 'locker-room',
  async asyncData({ app, route }) {
    const id = route.params.id
    // const { getNotification } = await app.$api.getNotification({ id })

    const { getNotificationWithMessages } =
      await app.$api.getNotificationWithMessages({ id })

    return { notificationWithMessages: getNotificationWithMessages }
  },
  computed: {
    ...mapFields('user', ['userID', 'userName', 'userAvatar']),
  },
  created() {
    this.metaTitle = 'Mentions & Replies'
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

    this.fnReadNotification()
  },
  beforeDestroy() {
    this.$root.$off('evtRtSendMessage')
  },
  methods: {
    async fnReadNotification() {
      const ids = [this.$route.params?.id]

      try {
        await this.$api.readNotification({ notificationIDs: ids })
      } catch (error) {}
    },
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
          channelSlug: this.notificationWithMessages?.Notification?.channelSlug,
          lockerRoomSlug:
            this.notificationWithMessages?.Notification?.LockerRoom?.slug,
          repliedTo: reply
            ? {
                User: {
                  username: reply?.name,
                  id: reply?.id,
                },
                text: reply?.text,
                chatID: reply?.chatID,
                Media: reply?.Media.length ? reply?.Media : null,
              }
            : null,
          Media: media.length ? media : null,
          MentionedUserIDs: mentionsUserIDs,
        }

        await this.socket.emit('send-message', chat, () => {
        })

        this.$nextTick(() => {
          const {
            channelSlug,
            LockerRoom: { slug },
          } = this.notificationWithMessages?.Notification || {}
          this.$router.push({
            path: `/locker-room/${slug}/${channelSlug}`,
          })
        })
      } catch (error) {
      } finally {
        const input = document.querySelector('.chat-input')

        input?.focus()
      }
    },
  },
}
</script>
