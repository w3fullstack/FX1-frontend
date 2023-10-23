<template lang="pug">
.xa-messages-channel-list-item(:class="{ active: active }", @click="$emit('click')")
  XAAvatar.avatar(:name="name", :image="iconUrl", size="62px")
  .chat-info
    p.chat-title {{ name }}
    p.chat-sender {{ sender }}
    p.chat-message {{ message }}
  .chat-time
    span {{ relativeTime }}
</template>

<script>
import moment from 'moment'

import XAAvatar from '~/components/atoms/Avatar.vue'

export default {
  name: 'XAMessagesChannelListItem',
  components: {
    XAAvatar,
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    iconUrl: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    sender: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    sentAt: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    relativeTime() {
      return this.sentAt ? moment(this.sentAt).from() : ''
    },
  },
}
</script>

<style lang="scss" scoped>
.xa-messages-channel-list-item {
  width: 100%;
  position: relative;
  cursor: pointer;

  display: flex;
  gap: 12px;
  padding: 12px 8px;

  &.active {
    background-color: #4f3b98;
    border-radius: 12px;
  }

  .chat-icon {
    flex-grow: 0;
    align-self: center;
    border-radius: 50%;
  }

  .chat-info {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .chat-title {
      color: #fff;
      font-size: 18px;
      font-weight: 500;
    }

    .chat-sender {
      color: $warning;
      font-size: 15px;
      font-weight: 500;
      line-height: 20px;
    }

    .chat-message {
      color: $dark-white;
      font-size: 15px;
      line-height: 20px;

      width: 80%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .chat-time {
    position: absolute;
    top: 12px;
    right: 8px;

    color: $grey-mute;
    font-size: 13px;
  }
}
</style>
