<template lang="pug">
.xa-messages-channel-bar
  nuxt-img.back(
    src="/v2/Messages/back.svg",
    width="24",
    height="24",
    @click="unsetChannel()"
  )
  p.channel-title {{ channel.name }}
  .menu-wrapper
    nuxt-img.menu-button(
      src="/v2/Messages/more.svg",
      width="24",
      height="24",
      @click="showMenu = true"
    )
    .menu(
      v-if="showMenu",
      v-click-outside="{ events: ['click'], handler() { showMenu = false } }",
      @click="showMenu = false"
    )
      button(type="button", @click="openShareDialog()")
        nuxt-img(src="/v2/Messages/share.svg", width="24", height="24")
        span Invite friends
      button(type="button", @click="openSettings()")
        nuxt-img(src="/v2/Messages/gear.svg", width="24", height="24")
        span Group Settings
      button.red(type="button", @click="leaveChannel()")
        nuxt-img(src="/v2/Messages/trash.svg", width="24", height="24")
        span(v-if="channel.isOwner") Delete and Leave
        span(v-else) Leave
</template>

<script>
import dialogs from '~/mixins/dialogs'

export default {
  name: 'XAMessagesChannelBar',
  mixins: [dialogs],
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showMenu: false,
    }
  },
  methods: {
    openShareDialog() {},
    openSettings() {
      this.fnCreatePrivateGroupDialog(this.channel, async () => {
        await this.$root.$emit('evtRtRetrievEncryptedChannels')
      })
    },
    async leaveChannel() {
      await this.$api.leavePrivateEncryptedChannel({
        channelID: this.channel.id,
      })
      this.unsetChannel(true)
    },
    unsetChannel(refresh) {
      this.$emit('unsetChannel', refresh)
    },
  },
}
</script>

<style lang="scss" scoped>
.xa-messages-channel-bar {
  display: grid;
  grid-auto-columns: 1fr 24px;
  grid-auto-flow: column;
  gap: 32px;
  padding: 13px 32px;
  align-content: center;
  border-bottom: 1px solid $secondary;

  @include max-width(534px) {
    grid-auto-columns: 24px 1fr 24px;
    padding: 8px;
    gap: 16px;
  }

  .back {
    display: none;
    margin-block: auto;
    cursor: pointer;

    @include max-width(534px) {
      display: unset;
    }
  }

  .channel-title {
    font-size: 22px;
    font-weight: 400;
  }

  .menu-wrapper {
    display: grid;
    position: relative;
  }

  .menu-button {
    margin-block: auto;
    cursor: pointer;
  }

  .menu {
    position: absolute;
    top: 29px;
    right: 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    padding: 15px 0;
    gap: 12px;

    border-radius: 5px;
    background: $secondary;
    box-shadow: 0 4px 10px 0 rgba(#0a272e, 0.15);
    z-index: 2;

    button {
      width: 100%;
      display: grid;
      grid-auto-flow: column;
      grid-auto-columns: 24px 1fr;
      grid-auto-rows: 1fr;
      gap: 8px;
      padding: 5px 20px;

      align-items: center;

      background-color: transparent;
      border: none;
      color: #fff;
      cursor: pointer;

      font-size: 14px;

      span {
        width: max-content;
      }

      &.red {
        color: $primary;
      }
    }
  }
}
</style>
