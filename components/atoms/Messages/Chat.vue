<template lang="pug">
.xa-messages-chat(ref="messageChatRef")
  XAEncryptedSplash(v-if="channelMessages.length === 0")
  XAEncryptedPopup(v-else)
  XOChannelsChatHistory(
    :cursored="false",
    :channel="channel",
    :isEncrypted="true"
    :chats="channelMessages",
    :showInfiniteLoading="false",
    :usersTyping="usersTyping",
  )
</template>

<script>
import XAEncryptedSplash from '~/components/atoms/Messages/EncryptedSplash.vue'
import XAEncryptedPopup from '~/components/atoms/Messages/EncryptedPopup.vue'
import XOChannelsChatHistory from '~/components/organisms/Channels/ChatHistory.vue'

export default {
  name: 'XAMessagesChat',
  components: {
    XAEncryptedSplash,
    XAEncryptedPopup,
    XOChannelsChatHistory,
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
  },
  watch: {
    usersTyping() {
      this.$nextTick(() => {
        const wrapper = this.$refs.messageChatRef
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
  }
}
</script>

<style lang="scss" scoped>
.xa-messages-chat::v-deep {
  height: 100%;
  padding: 20px 32px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px;
    background-color: $tertiary;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: $dark-electric-blue;
    border-radius: 10px;
  }
  .xo-channel-chat-history {
    flex-wrap: unset;
    height: 100%;
    .xa-channels-typing {
      min-height: unset;
      padding: 10px 0;
    }
  }
  @include max-width(534px) {
    padding-inline: 16px;
  }
}
</style>
