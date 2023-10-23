<template lang="pug">
.xo-channel-chat-history.flex-column(
  @contextmenu.prevent="",
  ref="historyChatContainer"
)
  infinite-loading(
    direction="top",
    :distance="300",
    @infinite="fnRetrieveNextChats",
    ref="infiniteLoading",
    v-show="(chats.length >= 10 && showInfiniteLoading) || !filteredLocalChats.length"
  )
    div(slot="spinner"): XAChannelsChatLoader
    div(slot="no-more")
    div(slot="no-results")
  XMChannelsChatItem(
    v-for="(addedChat, index) in filteredAddedChats",
    :key="`${index}-added-chat`",
    :chat="addedChat",
    :scroll-to-bottom="false",
    :small="true"
  )
  XMChannelsChatItem(
    v-for="(chat, index) in filteredLocalChats",
    :key="`${index}-chat`",
    :chat="chat",
    :is-last="index === filteredLocalChats.length - 1",
    :small="true"
  )
  XAChannelsTyping(v-show="usersTyping.length", :users-typing="usersTyping")

  .emoji(ref="privateChatEmoji", v-if="isLoggedIn")
    .buttons
      div(@click="toggleEmoji") 
        .toggle-open
      .close(@click="hide")
        span Close
        img(src="~assets/images/Club/close-icon.svg", alt="close")
    EmojiPicker(
      v-show="activeNav === 'Emoji'",
      :fullScreen="fullScreen"
      @updateMessage="$emit('updateMessage', $event)",
    )
    GifsComponent(
      v-show="activeNav !== 'Emoji'",
      :gifsToRender="gifsToRender",
      :search="search",
      :activeNav="activeNav",
      :fullScreen="fullScreen"
      @updateSearch="$emit('updateSearch', $event)",
      @handleScroll="$emit('handleScrollGifs', $event)",
      ref="gifsComponentRef",
    )
    .navigation
      .nav-button(
        v-for="item in navButtons",
        :key="item.id",
        :class="{ 'nav-button-active': item.label === activeNav }",
        @click="activeNav = item.label"
      )
        img(
          :src="require(`~/assets/images/Club/${item.icon}.svg`)",
          :alt="item.label"
        )
        span {{ item.label }}
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapGetters } from 'vuex'
import tippy, { hideAll } from 'tippy.js'
import 'tippy.js/animations/shift-away-extreme.css'
import EmojiPicker from '~/components/templates/LockerRoom/EmojiPicker.vue'
import GifsComponent from '~/components/templates/LockerRoom/GifsComponent.vue'

export default {
  name: 'XOChannelsChatHistory',
  components: {
    GifsComponent,
    EmojiPicker,
    XMChannelsChatItem: () =>
      import('~/components/molecules/Channels/ChatItem'),
    XAChannelsChatLoader: () =>
      import('~/components/atoms/Channels/ChatLoader'),
    XAChannelsTyping: () => import('~/components/atoms/Channels/Typing'),
  },
  props: {
    chats: { type: Array, default: () => [] },
    showInfiniteLoading: { type: Boolean, default: false },
    usersTyping: { type: Array, default: () => [] },
    channelSlug: { type: String, default: '' },
    activeChat: { type: [String, undefined], default: '' },
    search: { type: String, default: '' },
    privateChannel: { type: Object, default: () => {} },
  },
  data() {
    return {
      cursor: 10,
      addedChats: [],
      localChats: this.chats || [],
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
      fullScreen: false,
    }
  },
  computed: {
    ...mapFields('messages', ['messageNext']),
    ...mapFields('user', ['userID']),
    ...mapGetters({
      getChatDeletedForEveryone: 'chats/getChatDeletedForEveryone',
      getChatDeletedForSelf: 'chats/getChatDeletedForSelf',
      gifs: 'giphy/getGifs',
      filteredGifs: 'giphy/getFilteredGifs',
    }),
    gifsToRender() {
      return this.search?.length && this.filteredGifs.length
        ? this.filteredGifs
        : this.gifs
    },

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
  watch: {
    activeNav(newValue) {
      this.$emit('updateNav', newValue)
    },
    usersTyping() {
      this.$nextTick(() => {
        const wrapper = this.$refs.historyChatContainer.closest('.vuebar')
        const typingEl = document.querySelector('.xa-channels-typing')

        if (
          Math.floor(
            wrapper.scrollHeight -
              wrapper.offsetHeight -
              wrapper.scrollTop -
              typingEl.offsetHeight
          ) <= 0
        ) {
          this.$root.$emit('evtRtScrollToBottom')
        }
      })
    },
    chats: {
      deep: true,
      handler(newV) {
        this.cursor = 10
        this.addedChats = []
        this.localChats = newV
        this.fnRetrieveNextChats(this.$refs.infiniteLoading.stateChanger, true)
      },
    },
  },

  mounted() {
    tippy('#iconEmoji', {
      content: this.$refs.privateChatEmoji,
      animation: 'shift-away-extreme',
      maxWidth: 'none',
      interactive: true,
      touch: true,
      duration: [200, 300],
      trigger: 'click',
      hideOnClick: 'toggle',
      allowHTML: true,
    })

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
    hide() {
      hideAll()
    },
    toggleEmoji() {
      this.fullScreen = !this.fullScreen
    },
    async fnRetrieveNextChats($state, reset = false) {
      if (reset) {
        $state.reset()
        return
      }
      try {
        const params = {
          channelSlug:
            this.activeChat === 'private'
              ? this.privateChannel?.slug
              : this.channelSlug,
          count: 10,
          cursor: this.cursor,
        }
        const {
          getMessagesByChannelSlug: { items, next },
        } = await this.$api.getMessagesByChannelSlug(params)

        this.cursor = next

        if (items.length) {
          if (this.filteredLocalChats.length) {
            this.addedChats.unshift(...items)
          } else {
            this.localChats.unshift(...items)
          }
          $state.loaded()
          return
        }
        $state.complete()
      } catch (error) {
        error?.response?.errors.forEach((error) => {
          this.$toast.success(error.message, {
            duration: 5000,
            position: 'bottom-left',
            className: 'fx1-success',
            iconPack: 'mdi',
            icon: 'alert-circle-outline',
          })
        })
      }
    },
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
.xo-channel-chat-history::v-deep {
  .navigation {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    position: relative;
    width: 100%;
    min-height: 70px;
    background-color: #08252c;
    border-top: 1px solid #2a4e55;
    z-index: 2;

    .nav-button {
      max-width: 20px;
      max-height: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0.5;

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
    background-color: #08252c;
    overflow: hidden;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    width: 100% !important;

    &-mart {
      height: 270px !important;

      @media screen and (min-width: 1400px) {
        height: 400px !important;
      }

      @media screen and (max-width: 767px) {
        height: 175px !important;
      }
    }

    @media screen and (max-width: 767px) {
      top: 0 !important;
    }

    .emoji-mart-search input {
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

    .emoji-mart-scroll {
      height: fit-content !important;
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

  [id^='tippy-'] {
    width: 100% !important;
    pointer-events: inherit !important;
    z-index: 100 !important;
  }

  min-height: 100%;

  .infinite-loading-container {
    margin-bottom: 20px;
  }
}
</style>
