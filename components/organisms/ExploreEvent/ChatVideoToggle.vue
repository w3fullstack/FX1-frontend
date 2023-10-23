<template lang="pug">
.xo-chat-video-toggle
  .btns
    button.btn(
      type="button"
      v-for="option in modeOptions"
      :class="{ current: option.name === mode }"
      @click="mode = option.name"
    )
      nuxt-img(:src="option.iconUrl" width="24" height="24")
    .unread(v-if="unread")
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'XOChatVideoToggle',
  data() {
    return {
      modeOptions: [
        {
          name: 'chat',
          iconUrl: '/explore-event/chat-icon.svg'
        },
        {
          name: 'video',
          iconUrl: '/explore-event/video-icon.svg'
        },
      ]
    }
  },
  computed: {
    ...mapFields('chats', ['mode', 'unread']),
  },
  beforeMount() {
    this.mode = 'chat'
  },
  mounted() {
    this.$root.$on('evtRtShowScrollToBottom', (value) => {
      if (!value && this.mode === 'chat') {
        this.unread = false
      }
    })
  },
}
</script>

<style lang="scss" scoped>
.xo-chat-video-toggle {
  .btns {
    position: relative;
    padding: 2px;
    display: flex;
    background-color: $tertiary;
    border-radius: 8px;
    margin-bottom: 0;

    .btn {
      cursor: pointer;
      padding: 8px 15px;
      display: grid;
      place-content: center;
      background-color: transparent;
      border-radius: 7px;
      border: none;

      &.current {
        background-color: $purples;
      }
    }

    .unread {
      position: absolute;
      left: 30%;
      top: 21%;

      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #f85454;
    }
  }
}
</style>
