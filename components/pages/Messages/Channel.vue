<template lang="pug">
.xp-messages-channel
  template(v-if="Object.keys(channel).length")
    client-only
      XAChannelBar(:channel="channel", @unsetChannel="unsetChannel")
      XAChat(:key="channel.id", :channel="channel", :channelMessages="channelMessages", :usersTyping="usersTyping")
      XASendMessage(:channel="channel", ref="sendMessageRef")
  p.blank(v-else)
    | Choose who you want to message.
</template>

<script>
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import XAChannelBar from '~/components/atoms/Messages/ChannelBar'
import XAChat from '~/components/atoms/Messages/Chat'
import XASendMessage from '~/components/atoms/Messages/XASendMessage'

export default {
  name: 'XPMessagesChannel',
  components: {
    XAChannelBar,
    XAChat,
    XASendMessage,
  },
  props: {
    channel: {
      type: Object,
      required: false,
      default: () => {},
    },
    channelMessages: {
      type: Array,
      required: false,
      default: () => [],
    },
    usersTyping: {
      type: Array,
      required: false,
      default: () => [],
    },
    unsetChannel: {
      type: Function,
      required: false,
      default: () => {},
    },
  },
  computed: {
    ...mapGetters({
      getMediaFiles: 'media/getMediaFiles',
      getMediaMessages: 'media/getMediaMessages',
      getChatShowEdit: 'chats/getChatShowEdit',
    }),
    ...mapFields('user', ['userUID', 'userName']),
    ...mapFields('locker-room', ['lockerRoomReply', 'lockerRoomActive']),
  },
  mounted() {
    this.$root.$on('evtRtSetMessage', async () => {
      await this.fnSetMessage()
    })
  },
  beforeDestroy() {
    this.$root.$off('evtRtSetMessage')
  },
  methods: {
    ...mapActions({
      clearMediaFiles: 'media/clearMediaFiles',
      clearMediaMessages: 'media/clearMediaMessages',
      setMediaLocalFiles: 'media/setMediaLocalFiles',
    }),
    fnRetrieveMentionedUsers() {
      const chatInput = document.getElementById('chat-input')
      const mentions = chatInput.getElementsByClassName('mention')

      const mentionsUserIDs = []

      mentions.forEach((element) => {
        mentionsUserIDs.push(element.dataset.userId)
      })

      return { mentionsUserIDs }
    },
    fnDoneTyping() {
      this.$root.$emit('evtRtDoneTyping', {
        userID: this.userUID,
        userName: this.userName,
      })
    },
    fnSetMessage: debounce(function () {
      try {
        const { mentionsUserIDs } = this.fnRetrieveMentionedUsers()
        if (this.getChatShowEdit) {
          this.fnEditMessage()
          return
        }
        if (this.getMediaFiles.length > 10) {
          this.fnSuccessToast('Only 10 files are allowed to upload')
          return
        }
        const isUploading = this.getMediaMessages.map((x) => {
          return x?.isUploading
        })

        const allUploaded = isUploading.every((element) => element === false)
    
        if (!allUploaded) return

        const element = this.$refs.sendMessageRef.$refs.chatInput

        const placeholder = element.dataset.placeholder

        const medias = this.getMediaMessages.map((x) => {
          return { objectID: x?.objectID, objectType: x?.objectType }
        })

        const isFocusedInput = document.activeElement === element

        if (!isFocusedInput && element.innerHTML === placeholder) {
          element.innerHTML = placeholder
          return
        }

        if (!element.textContent && !this.getMediaFiles.length) {
          element.innerHTML = ''
          return
        }

        this.$root.$emit(
          'evtRtSendMessage',
          element.innerHTML.replace(/<br>/g, '\n'),
          this.lockerRoomReply,
          medias,
          mentionsUserIDs
        )

        this.fnDoneTyping()
        this.setMediaLocalFiles()
        this.$nextTick(() => {
          element.innerHTML = ''
          this.lockerRoomReply = null
          this.clearMediaFiles()
          this.clearMediaMessages()
        })
      } catch (error) {
        console.log(error)
      }
    }, 200),
  }
}
</script>

<style lang="scss" scoped>
.xp-messages-channel {
  grid-area: chat;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  background-color: $secondary_b;
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
</style>
