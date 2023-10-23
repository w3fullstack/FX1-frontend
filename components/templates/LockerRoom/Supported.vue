<template lang="pug">
.xt-locker-room-supported.row
  XOLockerRoomChannels(v-if="!isLive")
  .chat-container.col.flex-column(:class="{ 'h100vh' : isLive}")
    XOChannelsChatHeader(:isLive="isLive")
    .chat-history-container.col(
      ref="chatContainer"
      v-bar
      )
      .vuebar
        XOChannelsChatHistory(
          :chats="chats",
          :show-infinite-loading="showInfiniteLoading",
          :users-typing="usersTyping"
          :search="search",
          @updateMessage="emojis.push($event)",
          @updateSearch="search = $event",
          @updateNav="activeNav = $event"
        )

      .scroll-to-bottom.row.items-center.justify-center(
        v-if="showScrollToBottom",
        @click.prevent="fnScrollToBottom('smooth')"
      ): b-icon(
        icon="chevron-down",
        custom-size="mdi-24px"
      )
      .emoji(ref="emoji")
        .buttons
          div(@click="toggleEmoji")
            .toggle-open
          .close(@click="tippyInstance[0].hide()")
            span Close
            img(src="~assets/images/Club/close-icon.svg", alt="close")
        EmojiPicker(
          v-show="activeNav === 'Emoji'"
          :pickerStyles="{ height: 'calc(100vh - 375px) !important' }"
          :fullScreen="fullScreen"
          @updateMessage="emojis.push($event)"
        )
        GifsComponent(
          v-show="activeNav !== 'Emoji'"
          :gifsToRender="gifsToRender"
          :styles="{ height: 'calc(100vh - 375px) !important' }"
          :search="search"
          :activeNav="activeNav"
          :fullScreen="fullScreen"
          @updateSearch="search=$event"
          @handleScroll="fnHandleScrollGifs"
          ref="gifsComponentRef"
        )
        .navigation
          .nav-button(
            v-for="item in navButtons"
            :key="item.id"
            :class="{ 'nav-button-active': item.label === activeNav }"
            @click="activeNav = item.label"
          )
            img(
              :src="require(`~/assets/images/Club/${item.icon}.svg`)"
              :alt="item.label"
            )
            span {{ item.label }}
    XOChannelsChatInput(is-supporting :isLive="isLive" :emojis="emojis" :private-channel="channelActive")
  XTLockerRoomSidebarRight(v-if="showOnlineMembers && !isLive")
  XMChannelsChatLightbox
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import tippy, { hideAll } from 'tippy.js'
import 'tippy.js/animations/shift-away-extreme.css'
import debounce from 'lodash/debounce'
import EmojiPicker from './EmojiPicker.vue'
import XOLockerRoomChannels from '~/components/organisms/LockerRoom/Channels.vue'
import XOChannelsChatInput from '~/components/organisms/Channels/ChatInput.vue'
import GifsComponent from '~/components/templates/LockerRoom/GifsComponent.vue'

export default {
  name: 'XTLockerRoomSupported',
  components: {
    EmojiPicker,
    GifsComponent,
    XOLockerRoomChannels,
    XOChannelsChatInput,
    XOChannelsChatHeader: () =>
      import('~/components/organisms/Channels/ChatHeader'),
    XOChannelsChatHistory: () =>
      import('~/components/organisms/Channels/ChatHistory'),
    XTLockerRoomSidebarRight: () =>
      import('~/components/templates/LockerRoom/SidebarRight'),
    XMChannelsChatLightbox: () =>
      import('~/components/molecules/Channels/ChatLightbox'),
  },
  data() {
    return {
      showInfiniteLoading: false,
      showScrollToBottom: false,
      media: [],
      emojis: [],
      search:'',
      searchOffset: 0,
      activeNav: 'Emoji',
      navButtons: [
        {
          id: 1,
          label: 'Emoji',
          icon: 'emoji-icon'
        },
        {
          id: 2,
          label: 'Sticker',
          icon: 'sticker-icon'
        },
        {
          id: 3,
          label: 'GIF',
          icon: 'gif-icon'
        }
      ],
      tippyInstance: null,
      fullScreen: false,
    }
  },
  computed: {
    ...mapFields('app', ['showOnlineMembers']),
    ...mapFields('user', ['userName']),
    ...mapFields('channels', ['channelActive']),
    ...mapGetters({
      getMediaLightbox: 'media/getMediaLightbox'
    }),
    ...mapGetters({
      gifs: 'giphy/getGifs',
      filteredGifs: 'giphy/getFilteredGifs'
    }),
    gifsToRender() {
      return this.search.length && this.filteredGifs.length
        ? this.filteredGifs
        : this.gifs
    },
    chats() {
      return this.$parent?.chats || []
    },
    channel() {
      return this.$parent?.channel || {}
    },
    isLive() {
      return this.$parent?.isLive || false
    },
    usersTyping() {
      const users = this.$parent?.usersTyping.filter(
        (x) => x !== this.userName
      )

      return users || []
    },
    triggerGifsSearch() {
      return `${this.search}|${this.searchOffset}`;
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
    search () {
      this.$refs.gifsComponentRef.$refs.gifsContainerRef.scrollTop = 0

      this.searchOffset = 0
      this.setFilteredGifs([])
    },
    triggerGifsSearch: debounce(async function (newVal) {
      if (this.activeNav === 'GIF') await this.searchGifs({ value: newVal, offset: this.searchOffset, })
      else if (this.activeNav === 'Sticker') await this.searchGifs({ value: newVal, offset: this.searchOffset, stickers: true })
    }, 700),
    chats: {
      deep: true,
      handler() {
        this.fnScrollToBottom()
      },
    },
  },
  async created() {
    await this.loadGifs(this.activeNav === 'Sticker')
  },
  beforeMount() {
    window.addEventListener('resize', this.fnCheckWindowSize)
  },
  mounted() {
    this.tippyInstance = tippy('#iconEmoji', {
      content: this.$refs.emoji,
      appendTo: this.$refs.chatContainer,
      animation: 'shift-away-extreme',
      maxWidth: 'none',
      duration: [200, 300],
      trigger: 'click',
      hideOnClick: 'toggle',
      allowHTML: true
    })

    this.$root.$on('evtRtScrollToBottom', () => {
      this.fnScrollToBottom()
    })

    this.$root.$on('evtRtShowScrollToBottom', (value) => {
      this.showScrollToBottom = value
    })

    this.fnCheckWindowSize()

    this.$root.$on('evtRtSetLightboxMedia', (value) => {
      this.media = value
    })

    this.$root.$on('evtRtShowLightbox', (index) => {
      if (this.media.length) {
        this.$refs.lightboxGallery?.showImage(index)
      }
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.fnCheckWindowSize)
  },
  methods: {
    ...mapActions({
      loadGifs: 'giphy/loadGifs',
      searchGifs: 'giphy/searchGifs'
    }),
    ...mapMutations('giphy', ['setFilteredGifs', "setSelectedGif"]),
    hide() {
      hideAll()
    },
    toggleEmoji() {
      this.fullScreen = !this.fullScreen
    },
    fnScrollToBottom(behavior = 'auto') {
      // const lastElement = Array.from(
      //   document.querySelectorAll('.xm-channels-chat-item')
      // ).pop()

      const element = document.querySelector('.xa-channels-typing')

      element?.scrollIntoView({ behavior, block: 'end' })
      this.showInfiniteLoading = true
    },
    fnCheckWindowSize() {
      if (window.innerWidth <= 768) {
        this.showOnlineMembers = false
        return
      }

      this.showOnlineMembers = true
    },
    fnHandleScrollGifs(e) {
      const { clientHeight, scrollHeight, scrollTop } = e.target

      if (!this.search || (this.activeNav !== 'GIF' && this.activeNav !== 'Sticker')) return

      if (scrollHeight - clientHeight <= scrollTop) {
        this.searchOffset++
      }
    }
  },
}
</script>

<style lang="scss" scoped>

.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
}
.toggle-open {
  order: 1;
  border-bottom: 4px solid #557278;
  width: 45px;
  position: relative;
  top: 20px;
  opacity: 0;
  border-radius: 10px;
  pointer-events: none;
  @media screen and (max-width: 500px) {
    opacity: 1;
    pointer-events: all;
  }
}
.close {
  order: 3;
  margin-left: auto;
  width: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.xt-locker-room-supported::v-deep {
  width: 100%;

  .navigation {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    position: relative;
    width: 100%;
    height: 70px;
    background-color: #08252C;
    border-top: 1px solid #2A4E55;
    z-index: 2;

    .nav-button {
      max-width: 20px;
      max-height: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: .5;

      span {
        margin-top: 7px;
        font-weight: 400;
        font-size: 14px;
        line-height: 15px;
        color: #fff;
      }

      &-active {
        opacity: 1;
      }
    }
  }

  .emoji {
    position: relative;
    left: -5px;
    padding: 15px 0;
    background-color: #08252C;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    width: 100% !important;

    &-mart {
      height: 350px !important;

      @media screen and (min-width: 1400px) {
        height: 278px !important;
      }
    }

    .close {
      position: relative;
      top: 8px;
      left: 89%;
      cursor: pointer;

      span {
        margin-right: 10px;
      }

      @media screen and (max-width: 1150px) {
        left: 80%;
      }
    }
    .emoji-mart-search input {
      min-height: 36px !important;
      border: 1px solid #2A4E55;
      border-radius: 4px;
      width: 96%;
      margin: 15px;
      background-color: #0C353E;
      color: #94A6AA;
      font-weight: 400;
      font-size: 14px;
      line-height: 15px;

      @media screen and (max-width: 1150px) {
        width: 90%;
      }
    }
    .emoji-mart-scroll {
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

  [id^="tippy-"] {
    width: 100% !important;
    pointer-events: inherit !important;
    z-index: 100 !important;
  }

  .h100vh {
    height: 100vh !important;
    border-left: 1px solid #385860 !important;
  }

  .xo-locker-room-channels {
    height: calc(var(--vh, 1vh) * 100 - 80px);
  }

  .chat-container {
    height: calc(var(--vh, 1vh) * 100 - 80px);

    @include max-width(767px) {
      height: calc(var(--vh, 1vh) * 100 - 70px);
    }

    .chat-history-container {
      position: relative;

      .scroll-to-bottom {
        position: absolute;
        bottom: 20px;
        right: 20px;
        z-index: 1;
        background-color: #08252c;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
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
    }
  }
}
</style>
