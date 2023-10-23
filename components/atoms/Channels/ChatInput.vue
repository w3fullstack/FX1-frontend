<template lang="pug">
.xa-channels-input(v-click-outside="fnHideMention")
  At(
    :members="members",
    name-key="username",
    :class="hideMention && 'hide-mention'",
    @at="fnHandleAt"
  )
    template(slot="item", slot-scope="s")
      .list-item.row.items-center
        .avatar: XAAvatar(
          :name="s.item.username",
          :image="s.item.Avatar ? s.item.Avatar.PhotoURL : null",
          size="36px"
        )
        .username.col {{ s.item.username }}
    #chat-input.chat-input(
      ref="chatInput",
      contenteditable,
      data-placeholder="Message",
      @keydown.enter.exact.prevent="fnSendMessage()",
      @blur="fnDoneTyping()",
      @keyup="fnIsTyping()",
      @focus="fnSetSelectionStart(); hideMention = false"
    )
    template(v-slot:embeddedItem="s")
      span: span.mention(:data-user-id="s.current.id || s.current.uid") {{ s.current.username }}
</template>

<script>
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import { mapFields } from 'vuex-map-fields'
import { mapGetters, mapActions } from 'vuex'
import At from 'vue-at'
import XAAvatar from '~/components/atoms/Avatar.vue'

export default {
  name: 'XAChannelsInput',
  components: {
    At,
    XAAvatar,
  },
  props: {
    emojis: {
      type: Array,
      required: true,
    },
    privateChannel: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      members: [],
      hideMention: false,
      placeholder: '',
    }
  },
  computed: {
    ...mapFields('locker-room', ['lockerRoomReply', 'lockerRoomActive']),
    ...mapFields('user', ['userName', 'userEmail', 'unverifiedEmailAddress', 'isEmailVerified', 'isSocialAccount']),
    ...mapGetters({
      getMediaFiles: 'media/getMediaFiles',
      getMediaMessages: 'media/getMediaMessages',
      getChatActive: 'chats/getChatActive',
      getChatShowEdit: 'chats/getChatShowEdit',
    }),
  },
  watch: {
    getChatShowEdit: {
      deep: true,
      handler(value) {
        const element = document.querySelector('.chat-input')

        if (value) {
          element.innerHTML = this.getChatActive?.text
          const length = element.innerText.length

          this.$nextTick(() => {
            if (length) {
              const sel = window.getSelection()
              sel.collapse(element.lastChild, length)
            }
            element.focus()
          })
          return
        }
        element.innerHTML = 'Message'
      },
    },
    emojis: {
      deep: true,
      handler(newValue) {
        const chatInput = this.$refs.chatInput

        const placeholder = chatInput.dataset.placeholder

        if (chatInput.innerHTML === placeholder) {
          chatInput.innerHTML = newValue.at(-1)
        } else {
          chatInput.innerHTML += newValue.at(-1)
        }

        this.setCurrentCursorPosition(chatInput.innerHTML.length + 1)
        chatInput.focus()

        this.fnSetMentionStyle()
      },
    },
  },
  mounted() {
    this.$root.$on('evtRtInsertEmoji', (value) => {
      this.fnInsertEmoji(value)
    })

    this.$root.$on('evtRtSetMessage', () => {
      this.fnSendMessage()
    })

    const chatInput = this.$refs.chatInput

    chatInput.addEventListener('paste', this.onPaste)

    const placeholder = chatInput.dataset.placeholder

    !chatInput.innerHTML && (chatInput.innerHTML = placeholder)

    this.placeholder = placeholder

    chatInput.addEventListener('focus', this.onFocus)

    chatInput.addEventListener('blur', this.onBlur)

    // this.fnRetrieverLockerRoomUsers()
  },
  beforeDestroy() {
    const chatInput = this.$refs.chatInput

    chatInput.removeEventListener('paste', this.onPaste)

    chatInput.removeEventListener('focus', this.onFocus)

    chatInput.removeEventListener('blur', this.onBlur)
  },
  methods: {
    ...mapActions({
      clearMediaFiles: 'media/clearMediaFiles',
      clearMediaMessages: 'media/clearMediaMessages',
      setMediaLocalFiles: 'media/setMediaLocalFiles',
    }),
    createRange(node, chars, range) {
      if (!range) {
        range = document.createRange()
        range.selectNode(node)
        range.setStart(node, 0)
      }

      if (chars.count === 0) {
        range.setEnd(node, chars.count)
      } else if (node && chars.count > 0) {
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.textContent.length < chars.count) {
            chars.count -= node.textContent.length
          } else {
            range.setEnd(node, chars.count)
            chars.count = 0
          }
        } else {
          for (let lp = 0; lp < node.childNodes.length; lp++) {
            range = this.createRange(node.childNodes[lp], chars, range)

            if (chars.count === 0) {
              break
            }
          }
        }
      }

      return range
    },
    setCurrentCursorPosition(chars) {
      if (chars >= 0) {
        const selection = window.getSelection()
        const chatInput = this.$refs.chatInput

        const range = this.createRange(chatInput.parentNode, {
          count: chars,
        })

        if (range) {
          range.collapse(false)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }
    },
    fnSendMessage: debounce(async function () {
      try {
        const { mentionsUserIDs } = await this.fnRetrieveMentionedUsers()
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

        const element = this.$refs.chatInput

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
      }
    }, 200),
    fnSetSelectionStart() {
      const element = document.querySelector('.chat-input')
      if (element.textContent === 'Message') element.textContent = ''
    },
    fnInsertEmoji(value) {
      const chatInput = this.$refs.chatInput
      if (chatInput) chatInput.innerHTML = value
    },
    fnEditMessage() {
      const element = document.querySelector('.chat-input')

      if (!element.textContent) return
      try {
        const { chatID, repliedToChatID, Media } = this.getChatActive

        const mappedMedia = Media?.map((x) => {
          return { objectID: x?.objectID, objectType: x?.objectType }
        })

        const params = {
          chatID,
          text: element.innerHTML.replace(/<br>/g, '\n'),
          repliedToChatID: repliedToChatID || null,
          Media: mappedMedia || null,
          isEdited: true,
        }

        this.$root.$emit('evtRtHideEdit')
        this.$root.$emit('evtRtUpdateChatList', params)
        // await this.$api.editMessage(params)
        this.$root.$emit('evtRtEditMessage', params)
      } catch (error) {
      } finally {
        this.$root.$emit('evtRtCancelEdit')
      }
    },
    fnIsTyping: throttle(function () {
      const element = this.$refs.chatInput
      const textLength = element.innerText.length

      if (textLength > 1 && element.dataset.placeholder !== element.innerText) {
        const params = {
          lockerRoomID: this.lockerRoomActive?.id,
          userID: this.userUID,
          userName: this.userName,
        }

        this.$root.$emit('evtRtIsTyping', params)
      }
    }, 3000, { trailing: false }),
    fnDoneTyping() {
      // this.hideMention = true
      const params = {
        lockerRoomID: this.lockerRoomActive?.id,
        userID: this.userUID,
        userName: this.userName,
      }
      this.$root.$emit('evtRtDoneTyping', params)
    },
    fnRetrieverLockerRoomUsers: debounce(async function (text) {
      try {
        const {
          getUsersByLockerRoom: { items }
        } = await this.$api.getUsersByLockerRoom({
          text,
          lockerRoomID: this.privateChannel?.lockerRoomID,
        })

        this.members = items
      } catch (error) {
      }
    }, 500),
    fnSetMentionStyle() {
      const element = document.querySelector('.xo-channels-chat-input')
      const mention = document.querySelector('.atwho-inner')

      if (mention) {
        mention.style.width = element.clientWidth
      }
    },
    fnHandleAt(chunk) {
      this.fnRetrieverLockerRoomUsers(chunk)
    },
    fnRetrieveMentionedUsers() {
      const chatInput = document.getElementById('chat-input')
      const mentions = chatInput.getElementsByClassName('mention')

      const mentionsUserIDs = []

      mentions.forEach((element) => {
        mentionsUserIDs.push(element.dataset.userId)
      })

      return { mentionsUserIDs }
    },
    fnHideMention() {
      this.hideMention = true
    },
    onPaste(e) {
      e.preventDefault()
      const text = e.clipboardData.getData('text/plain')
      document.execCommand('insertHTML', false, text)
    },
    onFocus(e) {
      const value = e.target.innerHTML
      if (value === this.placeholder) {
        e.target.innerHTML = ''
      }
    },
    onBlur(e) {
      const value = e.target.innerHTML
      if (!value) {
        e.target.innerHTML = this.placeholder
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.xa-channels-input::v-deep {
  min-height: 20px;
  max-height: 200px;
  height: 100%;
  position: relative;

  @include max-width(767px) {
    max-height: 100px;
  }

  .chat-input {
    cursor: text;
    font-size: 1.1429rem;
    font-weight: 300;
    line-height: 1.4286rem;
    word-break: break-word;
    padding-right: 10px;
    overflow-y: auto;
    max-height: 200px;
    scrollbar-width: thin;
    scrollbar-color: #08252c $secondary;
    color: $grey-mute;

    &::-webkit-scrollbar {
      width: 16px;
    }

    &::-webkit-scrollbar-track {
      background-color: $secondary;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #08252c;
      border-radius: 10px;
      border: 3px solid $secondary;
    }

    span {
      display: inline-block;

      .mention {
        color: #886bf2;
        font-size: 1.1429rem;
        font-weight: 400;
      }
    }
  }
  .chat-input:focus {
    color: $white;
  }
  &.vb {
    > .vb-dragger {
      z-index: 5;
      width: 12px;
      right: 0;
      opacity: 0;

      > .vb-dragger-styler {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-transform: rotate3d(0, 0, 0, 0);
        transform: rotate3d(0, 0, 0, 0);
        -webkit-transition: background-color 100ms ease-out,
          margin 100ms ease-out, height 100ms ease-out;
        transition: background-color 100ms ease-out, margin 100ms ease-out,
          height 100ms ease-out;
        background-color: #08252c;
        margin: 5px 2px 0;
        border-radius: 20px;
        height: calc(100% - 10px);
        display: block;
      }

      &:hover {
        > .vb-dragger-styler {
          background-color: #08252c;
          height: 100%;
        }
      }
    }

    &.vb-scrolling-phantom {
      > .vb-dragger {
        > .vb-dragger-styler {
          background-color: #08252c;
        }
      }
    }

    &.vb-dragging {
      > .vb-dragger {
        > .vb-dragger-styler {
          background-color: #08252c;
          height: 100%;
        }
      }
    }

    &.vb-dragging-phantom {
      > .vb-dragger {
        > .vb-dragger-styler {
          background-color: #08252c;
        }
      }
    }

    &:hover {
      > .vb-dragger {
        opacity: 0.8;
      }
    }
  }

  .atwho-wrap {
    .atwho-panel {
      width: calc(100% + 155px);
      left: -74px !important;
      top: -27px !important;

      .atwho-inner {
        .atwho-view {
          background-color: $secondary;
          box-shadow: none;
          border-radius: 0px;
          left: 0;
          max-width: 100%;
          width: 100%;
          max-height: 450px;
          border-top: 1px solid rgba(#e7e8e8, 0.2);
          scrollbar-width: thin;
          scrollbar-color: #08252c $secondary;
          scrollbar-base-color: #08252c;

          &::-webkit-scrollbar {
            width: 15px;
          }

          &::-webkit-scrollbar-track {
            background-color: $secondary;
          }

          &::-webkit-scrollbar-thumb {
            background-color: #08252c;
            border-radius: 10px;
            border: 3px solid $secondary;
          }

          &::-webkit-scrollbar-thumb:vertical:hover {
            background-color: #08252c;
          }

          .atwho-ul {
            max-height: 450px;

            .atwho-li {
              padding: 0 0 0 15px;
              height: auto;

              .list-item {
                width: 100%;

                .xa-avatar {
                  margin-right: 10px;
                }

                .username {
                  border-bottom: 1px solid #385960;
                  padding: 16px 0;
                  color: $white;
                }
              }

              &.atwho-cur {
                background-color: darken($secondary, 3%);
              }
            }
          }
        }
      }
    }

    &.hide-mention {
      .atwho-panel {
        display: none;
      }
    }
  }
}
</style>
