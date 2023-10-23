<template lang="pug">
.xt-locker-room-supported.row
  .chat-container.col.flex-column(:class="{ h100vh: isLive }")
    .public(v-if="activeChat === 'public' && !lockerRoomConnectingToChannel")
      .chat-history-container.col(:class="{ cutted: !isLoggedIn }", v-bar)
        .vuebar
          XOChannelsChatHistory(
            :chats="chats",
            :show-infinite-loading="showInfiniteLoading",
            :users-typing="usersTyping",
            :channelSlug="channelSlug",
            :active-chat="activeChat",
            :search="search",
            @handleScrollGifs="fnHandleScrollGifs",
            @updateMessage="emojis.push($event)",
            @updateSearch="search = $event",
            @updateNav="activeNav = $event"
          )

        .scroll-to-bottom.row.items-center.justify-center(
          v-if="showScrollToBottom",
          @click.prevent="fnScrollToBottom('smooth', 'end')"
        ): b-icon(
          icon="chevron-down",
          custom-size="mdi-24px"
        )
      XOChannelsChatInput(
        v-if="isLoggedIn",
        is-supporting,
        :isLive="isLive",
        :emojis="emojis"
      )
    .private(
      v-if="activeChat === 'private' && privateChannel && !lockerRoomConnectingToChannel"
    )
      .chat-history-container.private-chat.col(
        :class="{ cutted: !isLoggedIn }",
        v-bar
      )
        .vuebar
          XOChannelsChatHistory(
            :chats="privateChats",
            :show-infinite-loading="showInfiniteLoading",
            :users-typing="usersTyping",
            :privateChannel="privateChannel",
            :active-chat="activeChat",
            :search="search",
            @handleScrollGifs="fnHandleScrollGifs",
            @updateMessage="emojis.push($event)",
            @updateSearch="search = $event",
            @updateNav="activeNav = $event"
          )

        .scroll-to-bottom.row.items-center.justify-center(
          v-if="showScrollToBottom",
          @click.prevent="fnScrollToBottom('smooth', 'end')"
        ): b-icon(
          icon="chevron-down",
          custom-size="mdi-24px"
        )
      XOChannelsChatInput(
        v-if="isLoggedIn",
        is-supporting,
        :isLive="isLive",
        :emojis="emojis",
        :active-chat="activeChat",
        :private-channel="privateChannel"
      )
    .private-creation(v-if="activeChat === 'private' && !privateChannel")
      .step.step-1(v-if="step === 1")
        span Group name
        XAFormsInput(
          v-model="groupName",
          :disabled="!isLoggedIn",
          :placeholder="'# My private group'",
          :error="validation.firstError('groupName')"
        )

      .step.step-2(v-if="step === 2", @scroll="onScrollUsers")
        span Add Members

        XAFormsInput(
          v-model="searchFriends",
          :placeholder="'Search'",
          @input="filterAvailableUsers"
        )

        p Find your friends below or invite new friends once your group is created.

        XALoader(v-if="isSearchingUsers")

        XOChatFriendsList(
          v-show="!isSearchingUsers",
          :friendsList="usersList",
          :onlineMembers="onlineMembers",
          :selectedFriendsIds.sync="selectedFriendsIds"
        )

        XALoader(v-if="isFetchingUsers")

      .actions.actions-1(v-if="step === 1 && isLoggedIn")
        b-button.is-uppercase.cancel(@click="cancel()") {{ 'CANCEL' }}
        b-button.is-uppercase.next(
          @click="nextStep()",
          type="is-primary",
          :loading="nextLoading"
        ) {{ 'NEXT' }}
      .actions.actions-2(v-if="step === 2")
        b-button.is-uppercase.back(@click="back()") {{ 'BACK' }}
        b-button.is-uppercase.create(
          @click="create()",
          type="is-primary",
          :loading="createLoading"
        ) {{ 'CREATE' }}
    .members(
      v-if="activeChat === 'private-members' || activeChat === 'public-members'"
    )
      XAFormsInput(
        v-model="searchMembers",
        :placeholder="'Search'",
        :disabled="!isLoggedIn"
      )
      .members-list
        .member(v-for="member in members", :key="member.User.id")
          .member-avatar(:class="[userOnline(member.User.id) ? 'online' : '']")
            img(
              v-if="member.User.Avatar && member.User.Avatar.PhotoURL",
              :src="member.User.Avatar.PhotoURL"
            )
            .default-avatar(v-else) {{ member.User.username.charAt(0).toUpperCase() }}
          span {{ member.User.username }}
  XMChannelsChatLightbox
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import { Validator } from 'simple-vue-validator'
import debounce from 'lodash/debounce'
import { hideAll } from 'tippy.js'

import XOLockerRoomChannels from '~/components/organisms/LockerRoom/Channels.vue'
import XOChannelsChatInput from '~/components/organisms/Channels/ChatInput.vue'
import GifsComponent from '~/components/templates/LockerRoom/GifsComponent.vue'

export default {
  name: 'XTLockerRoomSupported',
  components: {
    XOLockerRoomChannels,
    XOChannelsChatInput,
    GifsComponent,
    XOChannelsChatHeader: () =>
      import('~/components/organisms/Channels/ChatHeader'),
    XOChannelsChatHistory: () =>
      import('~/components/organisms/Channels/EventChatHistory'),
    XOChatFriendsList: () =>
      import('~/components/organisms/ExploreEvent/ChatFriendsList'),
    XMChannelsChatLightbox: () =>
      import('~/components/molecules/Channels/ChatLightbox'),
    XAFormsInput: () => import('~/components/atoms/Forms/Input'),
    XALoader: () => import('~/components/atoms/Loader'),
  },
  props: {
    channelSlug: {
      type: String,
      default: '',
    },
    game: {
      type: Object,
      default: () => {},
    },
    privateChannel: {
      type: Object,
      default: () => {},
    },
    privateChats: {
      type: Array,
      default: () => [],
    },
    activeChat: {
      type: String,
      required: true,
    },
    currentStep: {
      type: Number,
      default: 1,
    },
    lockerRoom: {
      type: Object,
      default: () => {},
    },
    publicMembers: {
      type: Array,
      default: () => [],
    },
    onlineMembers: {
      type: Array,
      default: () => [],
    },
  },
  validators: {
    groupName(value) {
      return Validator.value(value).required('Group Name field is required.')
    },
  },
  data() {
    return {
      showInfiniteLoading: false,
      showScrollToBottom: false,
      groupName: '',
      searchFriends: '',
      searchMembers: '',
      usersList: [],
      filteredMembers: null,
      usersCountLeft: null,
      step: this.currentStep,
      selectedFriendsIds: [],
      nextLoading: false,
      createLoading: false,
      isFetchingUsers: false,
      isSearchingUsers: false,
      media: [],
      emojis: [],
      search: '',
      searchOffset: 0,
      activeNav: 'Emoji',
      members: [],
    }
  },

  computed: {
    ...mapFields('app', ['showOnlineMembers']),
    ...mapFields('user', ['userName']),
    ...mapFields('locker-room', ['lockerRoomConnectingToChannel']),
    ...mapGetters({
      getMediaLightbox: 'media/getMediaLightbox',
    }),
    privateOwner() {
      return this.privateChannel?.Roles.Owners || []
    },
    privateJoiners() {
      return this.privateChannel?.Roles.Joiners || []
    },
    allPrivateMembers() {
      return [...this.privateOwner, ...this.privateJoiners]
    },
    chats() {
      return this.$parent?.chats || []
    },
    channel() {
      return this.$parent?.channel || {}
    },
    channelGroupID() {
      return this.channel?.channelGroupID || null
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
    onlineUsers() {
      const onlineUsers = this.onlineMembers
        ? this.onlineMembers.map((e) => {
            return e?.User?.id
          })
        : []

      return onlineUsers
    },
    userOnline() {
      return (user) => this.onlineUsers.includes(user)
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
    triggerGifsSearch: debounce(async function (newVal) {
      if (this.activeNav === 'GIF')
        await this.searchGifs({ value: newVal, offset: this.searchOffset })
      else if (this.activeNav === 'Sticker')
        await this.searchGifs({
          value: newVal,
          offset: this.searchOffset,
          stickers: true,
        })
    }, 700),
    activeChat: {
      handler() {
        hideAll()
        this.fnScrollToBottom()
        this.getMemberList()
      },
    },
    currentStep: {
      handler(newValue) {
        this.step = newValue
      },
    },
    searchMembers: {
      deep: true,
      handler(newValue) {
        this.getMemberList()
        if (newValue === '') {
          this.filteredMembers = null
        } else {
          this.filterMembersList(newValue)
        }
      },
    },
  },
  async created() {
    await this.loadGifs(this.activeNav === 'Sticker')
    this.fnScrollToBottom()
    this.getMemberList()
  },
  beforeMount() {
    window.addEventListener('resize', this.fnCheckWindowSize)
  },
  mounted() {
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
      searchGifs: 'giphy/searchGifs',
    }),
    ...mapMutations('giphy', ['setFilteredGifs']),

    onScrollUsers(e) {
      const bottomOfElement =
        e.target.scrollTop + e.target.clientHeight + 100 > e.target.scrollHeight

      if (
        bottomOfElement &&
        !this.isFetchingUsers &&
        (this.usersCountLeft ?? true)
      ) {
        this.loadNext()
      }
    },
    async loadNext() {
      this.isFetchingUsers = true

      try {
        const { getAvailableUsersForPrivateChannel } =
          await this.$api.getAvailableMembersForPrivateChannel({
            lockerRoomID: this.lockerRoom.id,
            next: this.usersList.length
              ? this.usersList[this.usersList.length - 1].id
              : null,
            name: this.searchFriends,
          })
        this.usersList.push(...getAvailableUsersForPrivateChannel.items)
        this.usersCountLeft = getAvailableUsersForPrivateChannel.count
      } catch (e) {
        this.$toast.error(e?.message || 'Something went wrong', {
          duration: 3000,
          position: 'bottom-left',
          className: 'fx1-error',
          iconPack: 'mdi',
          icon: 'alert-circle-outline',
        })
      }

      this.isFetchingUsers = false
    },
    nextStep() {
      this.nextLoading = true
      this.$validate().then(async (success) => {
        if (success) {
          try {
            this.nextLoading = true

            const { getAvailableUsersForPrivateChannel } =
              await this.$api.getAvailableMembersForPrivateChannel({
                lockerRoomID: this.lockerRoom.id,
              })

            this.usersList = getAvailableUsersForPrivateChannel.items
            this.usersCountLeft = getAvailableUsersForPrivateChannel.count

            this.nextLoading = false

            this.$emit('changeStep', 2)
          } catch (error) {
            console.error(error)
          } finally {
            this.nextLoading = false
          }
        } else {
          this.nextLoading = false
        }
      })
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
    back() {
      this.$emit('changeStep', 1)
    },
    cancel() {
      this.$emit('cancel')
    },
    async create() {
      const friendsIds = this.selectedFriendsIds
      this.createLoading = true

      const { createChannel } = await this.$api.createChannel({
        input: {
          name: this.groupName,
          type: 'Private',
          channelGroupID: this.channelGroupID,
          userIDs: friendsIds,
        },
      })
      this.$mixpanelClient.trackCreatePrivateRoom({
        lockerRoom: this.lockerRoom,
        game: this.game,
      })
      this.$emit('getPrivateChannel', createChannel.objectID)
      this.createLoading = false
    },
    fnScrollToBottom(behavior = 'auto', block = 'end') {
      if (behavior & block) {
        const element = document.querySelector('.xa-channels-typing')

        this.$nextTick(() => {
          element?.scrollIntoView({ behavior, block })
          this.showInfiniteLoading = true
        })

        return
      }

      const wrapper = document
        .querySelector('.xo-channel-chat-history')
        ?.closest('.vuebar')

      if (wrapper) {
        wrapper.scrollTo({
          top: wrapper.scrollHeight,
          behavior: 'smooth',
        })
      }
      this.showInfiniteLoading = true
      this.showScrollToBottom = false
    },
    fnCheckWindowSize() {
      if (window.innerWidth <= 768) {
        this.showOnlineMembers = false
        return
      }

      this.showOnlineMembers = true
    },

    getMemberList() {
      if (this.activeChat === 'public-members') {
        this.members = [...this.publicMembers]
      } else if (this.activeChat === 'private-members') {
        this.members = [...this.allPrivateMembers]
      }
    },
    filterMembersList(inputValue) {
      if (inputValue !== '') {
        this.filteredMembers = this.members.filter((user) =>
          user.User.username.toLowerCase().includes(inputValue.toLowerCase())
        )
        this.members = this.filteredMembers
      }
    },

    filterAvailableUsers: debounce(async function () {
      this.isSearchingUsers = true

      const { getAvailableUsersForPrivateChannel } =
        await this.$api.getAvailableMembersForPrivateChannel({
          lockerRoomID: this.lockerRoom.id,
          name: this.searchFriends,
        })

      this.usersList = getAvailableUsersForPrivateChannel.items
      this.usersCountLeft = getAvailableUsersForPrivateChannel.count

      this.isSearchingUsers = false
    }, 500),
  },
}
</script>

<style lang="scss" scoped>
.private-chat {
  height: calc(100% - 60px) !important;

  -ms-overflow-style: none;
  scrollbar-width: none;

  @media screen and (max-width: 750px) {
    padding-bottom: 0 !important;
  }
}

.xo-explore-event-chat.hide .xo-channels-chat-input.is-supporting {
  margin-bottom: -100px;
}

.xo-channels-chat-input.is-supporting {
  padding: 20px;
  position: absolute;
  bottom: 0;
  width: 100%;

  @include max-width(767px) {
    position: absolute !important;
    width: 100% !important;
    padding: 22px 30px;
    bottom: 0px !important;
  }
}

.xt-locker-room-supported::v-deep {
  height: 100%;
  width: 100%;

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
    left: -5px;
    padding-top: 15px;
    background-color: #08252c;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    width: 100% !important;

    &-mart {
      height: 270px;
      @media screen and (min-width: 1400px) {
        height: 400px !important;
      }
    }
    .openEmoji {
      @media screen and (max-width: 767px) {
        min-height: 657px !important;
      }
      @media screen and (max-width: 425px) {
        min-height: 467px !important;
      }
    }

    .close {
      position: relative;
      top: 8px;
      left: 78%;
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
      border: 1px solid #2a4e55;
      border-radius: 4px;
      width: 90%;
      margin: 15px;
      background-color: #0c353e;
      color: #94a6aa;
      font-weight: 400;
      font-size: 14px;
      line-height: 15px;

      @media screen and (max-width: 1150px) {
        width: 93%;
      }
    }
    .emoji-mart-scroll {
      padding: 0 6px 6px 18px;

      &::-webkit-scrollbar {
        display: none;
      }

      &::-webkit-scrollbar-track {
        display: none;
      }

      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  }

  [id^='tippy-'] {
    width: 100% !important;
    bottom: 10px !important;
    pointer-events: inherit !important;
    z-index: 100 !important;
  }

  .h100vh {
    height: 100vh !important;
    border-left: 1px solid #385860 !important;
  }

  .chat-container {
    height: 100%;
    .chat-history-container {
      overflow-y: scroll !important;
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
      height: calc(100% - 70px);

      &.cutted {
        height: 87%;
      }

      @include max-width(767px) {
        height: calc(100% - 58px) !important;
      }

      .vuebar {
        height: 100% !important;
        padding: 12px !important;
        display: block;
        overflow: hidden scroll;
        box-sizing: content-box;

        @include max-width(480px) {
          height: 95% !important;
        }
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
    .chat-history-container::-webkit-scrollbar {
      display: none;
    }
    .public,
    .private {
      height: 100%;
    }
    .public,
    .private {
      .chat-history-container {
        position: relative;

        .xo-channels-chat-input.is-supporting {
          padding: 51px 30px;
          padding-bottom: 0px !important;
          width: 100%;
        }
      }
    }
    .private-creation {
      height: 100%;

      .step {
        overflow-y: scroll;
        height: calc(100% - 92px);
        padding: 25px 12px;
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        @include max-width(427px) {
          height: calc(100% - 111px) !important;
        }

        span {
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          color: $white;
          opacity: 0.7;
          text-transform: uppercase;
        }
        input {
          margin: 25px 0;
          background-color: transparent;
          border: 1px solid #2a4e55 !important;
          color: $grey-mute !important;
        }
        input::placeholder {
          color: $grey-mute !important;
        }
        p {
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
          color: $white;
          opacity: 0.5;
        }
      }
      .step::-webkit-scrollbar {
        display: none;
      }
      .step-2 {
        input {
          padding-left: 40px;
        }
        .control {
          position: relative;
        }
        .control:before {
          content: '';
          width: 20px;
          height: 20px;
          position: absolute;
          top: 42px;
          left: 12px;
          background-image: url('~assets/images/explore-event/search.svg');
        }
        .xa-loader {
          display: flex;
          position: relative;
        }
      }
      .actions {
        width: 100%;
        display: flex;
        padding: 25px 0;
        justify-content: center;
        border-top: 1px solid rgba(231, 232, 232, 0.2);
        background-color: $secondary;

        @include max-width(427px) {
          margin: 0 !important;
        }

        button {
          padding: 20px 55px !important;
          font-weight: 500;
          font-size: 14px;
          line-height: 18px;
          @include max-width(500px) {
            height: unset !important;
          }
          @include max-width(427px) {
            padding: 12px 55px !important;
          }
        }
        .back,
        .create {
          padding: 20px 25px !important;
        }
        .back {
          background-color: transparent;
          color: $white;
          border: unset;
        }
        .cancel {
          display: none;
          background-color: transparent;
          color: $white;
          border: unset;
          @include max-width(767px) {
            display: flex;
          }
        }
      }
      .actions-1 {
        padding: 25px 12px;
        button {
          width: 100%;
        }
      }
    }
    .members {
      height: calc(100% - 35px);
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
      padding: 20px 12px;
      @include max-width(500px) {
        height: calc(100% - 15px);
      }
      .members-list {
        display: flex;
        flex-direction: column;
        overflow: auto !important;
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        .member {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          .member-avatar {
            display: flex;
            position: relative;
            margin-right: 16px;

            img {
              width: 32px;
              height: 32px;
              border-radius: 50%;
            }
            .default-avatar {
              width: 32px;
              height: 32px;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: $primary;
              border-radius: 50%;
              font-weight: 300;
              font-size: 13px;
              text-transform: uppercase;
            }
          }
          .online::after {
            content: '';
            position: absolute;
            width: 12px;
            height: 12px;
            bottom: -3px;
            right: -2px;
            background-color: #2ddc1e;
            border-radius: 50%;
            border: 3px solid $secondary-dark;
          }
          span {
            font-weight: 400;
            font-size: 15px;
            line-height: 20px;
            color: $white;
            opacity: 0.5;
            text-transform: none;
          }
        }
      }
      .members-list::-webkit-scrollbar {
        display: none;
      }
      input {
        padding-left: 40px;
        margin-bottom: 15px;
        background-color: transparent;
        border: 1px solid #2a4e55 !important;
        color: $grey-mute !important;
      }
      input::placeholder {
        color: $grey-mute !important;
      }

      .control {
        position: relative;
      }
      .control:before {
        content: '';
        width: 20px;
        height: 20px;
        position: absolute;
        top: 17px;
        left: 12px;
        background-image: url('~assets/images/explore-event/search.svg');
      }
    }
    .members::-webkit-scrollbar {
      display: none;
    }
    .scroll-to-bottom {
      position: absolute;
      bottom: 60px;
      right: 20px;
      z-index: 1;
      background-color: #08252c;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
</style>
