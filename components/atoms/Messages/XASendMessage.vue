<template lang="pug">
.xa-send-message(v-click-outside="fnHideMention")
  XAChannelsReplyTo(v-if="hasReply", :can-cancel="true")
  .file-upload-container.row(v-if="getMediaFiles.length")
    XAFileUpload(
      v-for="(file, index) in getMediaFiles",
      :file="file",
      :key="file.name",
      @delete="fnDeleteImageOnLocal(file)"
    )
  .left-side
    input(
      type="file",
      ref="file",
      style="display: none",
      accept="image/x-png,image/jpeg,image/jpg,image/png,image/webp,image/avif,image/heic,image/heif,image/tiff,image",
      multiple,
      @input="fnSetMediaUpload"
    )
    nuxt-img(
      @click="$refs.file.click()",
      src="/v2/Messages/plus_thin.svg",
      width="20",
      height="20",
    )
  .center-chat
    At(
      :members="members",
      name-key="username",
      :class="hideMention && 'hide-mention'",
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
        contenteditable,
        data-placeholder="Message",
        @keydown.enter.exact.prevent="fnSetMessage()",
        @keyup="fnIsTyping()",
        @blur="fnDoneTyping()",
        ref="chatInput"
      )
      template(v-slot:embeddedItem="s")
        span: span.mention(:data-user-id="s.current.id || s.current.uid") {{ s.current.username }}
  .right-side
    nuxt-img(
      @click="fnSetMessage()",
      class="send-message-icon"
      src="~assets/images/Club/send.svg",
      width="20",
      height="20"
    )
    nuxt-img(
      src="~assets/images/Club/emoji.svg",
      width="20",
      height="20",
      @click="isOpenedEmoji = !isOpenedEmoji"
    )

  .xa-send-message__emoji_container(
    ref="privateChatEmoji",
    v-if="isOpenedEmoji"
  )
    .xa-send-message__header
      .xa-send-message__close(@click="isOpenedEmoji = false")
        span Close
        nuxt-img(src="~assets/images/Club/close-icon.svg")

    EmojiPicker(
      v-show="activeNav === 'Emoji'",
      @updateMessage="emojis.push($event)",
      :fullScreen="isOpenedEmoji"
    )

    GifsComponent(
      v-show="activeNav !== 'Emoji'",
      :gifsToRender="gifsToRender",
      :search="search",
      :activeNav="activeNav",
      :fullScreen="isOpenedEmoji",
      @updateSearch="search = $event",
      @handleScroll="fnHandleScrollGifs",
      ref="gifsComponentRef"
    )

    .xa-send-message__navigation
      .xa-send-message__nav-button(
        v-for="item in navButtons",
        :key="item.id",
        :class="{ 'xa-send-message__nav-button-active': item.label === activeNav }",
        @click="activeNav = item.label"
      )
        img(
          :src="require(`~/assets/images/Club/${item.icon}.svg`)",
          :alt="item.label"
        )
        span {{ item.label }}
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import At from 'vue-at'
import EmojiPicker from '~/components/templates/LockerRoom/EmojiPicker.vue'
import GifsComponent from '~/components/templates/LockerRoom/GifsComponent.vue'
import XAAvatar from '~/components/atoms/Avatar.vue'
import XAChannelsReplyTo from '~/components/atoms/Channels/ReplyTo.vue'

export default {
  name: 'XASendMessage',
  components: {
    At,
    GifsComponent,
    EmojiPicker,
    XAAvatar,
    XAChannelsReplyTo,
    XAFileUpload: () => import('~/components/atoms/FileUpload'),
  },
  props: {
    channel: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      isOpenedEmoji: false,
      hideMention: false,
      navButtons: [
        {
          id: 1,
          label: 'Emoji',
          icon: 'emoji-icon',
        },
        {
          id: 2,
          label: 'Sticker',
          icon: 'sticker-icon',
        },
        {
          id: 3,
          label: 'GIF',
          icon: 'gif-icon',
        },
      ],
      activeNav: 'Emoji',
      search: '',
      placeholder: '',
      searchOffset: 0,
      emojis: [],
    }
  },
  computed: {
    ...mapGetters({
      getMediaFiles: 'media/getMediaFiles',
      gifs: 'giphy/getGifs',
      filteredGifs: 'giphy/getFilteredGifs',
    }),
    ...mapFields('user', ['userUID', 'userName']),
    ...mapFields('locker-room', ['lockerRoomActive', 'lockerRoomReply']),
    members() {
      return this.channel.joiners.map((j) => j.User)
    },
    hasReply() {
      return !!this.lockerRoomReply
    },
    gifsToRender() {
      return this.search?.length && this.filteredGifs.length
        ? this.filteredGifs
        : this.gifs
    },
    triggerGifsSearch() {
      return `${this.search}|${this.searchOffset}`
    },
  },
  watch: {
    async activeNav(newVal) {
      this.search = ''
      this.searchOffset = 0
      this.setFilteredGifs([])

      if (newVal === 'GIF') await this.loadGifs()
      if (newVal === 'Sticker') await this.loadGifs(true)
    },
    search() {
      document.querySelector('.gifs-container').scrollTop = 0

      this.searchOffset = 0
      this.setFilteredGifs([])
    },
    $route: {
      deep: true,
      immediate: true,
      handler() {
        this.clearMediaFiles()
      },
    },
    triggerGifsSearch: debounce(async function (newVal) {
      if (this.activeNav === 'GIF') {
        await this.searchGifs({
          value: newVal,
          offset: this.searchOffset,
        })
      }
      if (this.activeNav === 'Sticker')
        await this.searchGifs({
          value: newVal,
          offset: this.searchOffset,
          stickers: true,
        })
    }, 700),
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

        this.setCurrentCursorPosition(chatInput.innerHTML.length)
        chatInput.focus()
      },
    },
  },
  mounted() {
    const chatInput = this.$refs.chatInput

    chatInput.addEventListener('paste', this.onPaste)

    const placeholder = chatInput.dataset.placeholder

    !chatInput.innerHTML && (chatInput.innerHTML = placeholder)

    this.placeholder = placeholder

    chatInput.addEventListener('focus', this.onFocus)

    chatInput.addEventListener('blur', this.onBlur)
  },
  beforeDestroy() {
    const chatInput = this.$refs.chatInput

    chatInput.removeEventListener('paste', this.onPaste)

    chatInput.removeEventListener('focus', this.onFocus)

    chatInput.removeEventListener('blur', this.onBlur)
  },
  methods: {
    ...mapActions({
      loadGifs: 'giphy/loadGifs',
      searchGifs: 'giphy/searchGifs',
      setMediaFiles: 'media/setMediaFiles',
      clearMediaFiles: 'media/clearMediaFiles',
      deleteMediaFiles: 'media/deleteMediaFiles',
    }),
    ...mapMutations('giphy', ['setFilteredGifs']),
    resize() {
      const element = this.$refs.chatInput

      element.style.height = '16px'
      element.style.height = element.scrollHeight + 'px'
    },
    fnSetMessage() {
      this.$root.$emit('evtRtSetMessage')
    },
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

        const range = this.createRange(chatInput, {
          count: chars,
        })

        if (range) {
          range.collapse(false)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }
    },
    fnHideMention() {
      this.hideMention = true
    },
    fnHandleScrollGifs(e) {
      const { clientHeight, scrollHeight, scrollTop } = e.target

      if (
        !this.search ||
        (this.activeNav !== 'GIF' && this.activeNav !== 'Sticker')
      )
        return

      if (scrollHeight - clientHeight <= scrollTop) {
        this.searchOffset++
      }
    },
    fnIsTyping: throttle(function () {
      const element = this.$refs.chatInput
      const textLength = element.innerText.length

      if (textLength > 1 && element.dataset.placeholder !== element.innerText) {
        const params = {
          userID: this.userUID,
          userName: this.userName,
        }

        this.$root.$emit('evtRtIsTyping', params)
      }
    }, 3000, { trailing: false }),
    fnDoneTyping() {
      this.$root.$emit('evtRtDoneTyping', {
        userID: this.userUID,
        userName: this.userName,
      })
    },
    fnSetMediaUpload(e) {
      this.$nextTick(() => {
        const files = e.target.files

        if (files.length > 10) {
          this.fnSuccessToast('Only 10 files are allowed to upload')
          return
        }

        const arrFiles = [...files]

        arrFiles.forEach((file) => {
          const cancelUpload = this.getMediaFiles.filter((x) => {
            return x?.name === file?.name
          })

          if (cancelUpload.length) return
          this.setMediaFiles(file)
        })

        this.$refs.file.value = null
      })
    },
    fnDeleteImageOnLocal(file) {
      this.deleteMediaFiles(file)
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
.xa-send-message::v-deep {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px 32px;
  border-top: 1px solid #2a4e55;
  img {
    cursor: pointer;
  }
  .xa-channels-reply-to {
    margin-bottom: unset;
  }
  .file-upload-container {
    gap: 15px;
    width: 100%;
    .xa-file-upload {
      margin: unset;
    }
  }
  .center-chat {
    flex-grow: 1;
    .atwho-wrap {
      display: flex;
      justify-content: flex-end;
      .atwho-panel {
        width: calc(100% + 120px);
        left: -60px !important;
        top: -20px !important;
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
    }
  }
  .right-side {
    .send-message-icon {
      margin-right: 22px;
    }
  }
  .chat-input {
    width: 100%;
  }
  .xa-send-message__emoji_container {
    position: absolute;
    right: 0;
    bottom: 60px;
    background-color: #08252c;
    overflow: hidden;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    width: 50%;
    height: 450px;
    display: grid;
    grid-template-rows: auto 300px auto;
    border: 1px solid #2a4e55;
    z-index: 1;
    @include max-width(1060px) {
      width: 100%;
    }
    .gifs {
      display: grid;
      grid-template-rows: auto 1fr;

      .gifs-container {
        height: unset !important;
      }
    }
    .emoji-mart {
      display: grid;
      grid-template-rows: auto 1fr;
      height: unset !important;
      .emoji-mart-search {
        margin-top: unset;
        input {
          min-height: 36px !important;
          border: 1px solid #2a4e55;
          border-radius: 4px;
          width: 96%;
          margin: 15px;
          background-color: #0c353e;
          color: #94a6aa;
          font-weight: 400;
          font-size: 14px;
          line-height: 15px;

          @media screen and (min-width: 1150px) {
            width: 93%;
          }
        }
      }
      .emoji-mart-scroll {
        overflow: auto;
        height: 100%;
        padding: 0 6px 6px 18px;

        -ms-overflow-style: none;
        scrollbar-width: none;

        &::-webkit-scrollbar {
          display: none;
        }

        &::-webkit-scrollbar-track {
          display: none;
        }
      }
    }
  }
  .xa-send-message__header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px 20px;
  }
  .xa-send-message__close {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 10px;
  }
  .xa-send-message__navigation {
    min-height: 70px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
    align-items: center;
    border-top: 1px solid #2a4e55;
    position: relative;
    z-index: 2;
    background-color: #08252c;
  }
  .xa-send-message__nav-button {
    display: grid;
    align-items: center;
    justify-items: center;
    cursor: pointer;
    opacity: 0.5;
    span {
      margin-top: 7px;
      font-weight: 400;
      font-size: 14px;
      line-height: 15px;
      color: #fff;
    }
  }
  .xa-send-message__nav-button-active {
    opacity: 1;
  }
}
</style>
