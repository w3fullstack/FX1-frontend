<template lang="pug">
XPMessagesChannel(
  :channel="channel",
  :channelMessages="channelMessages"
  :usersTyping="usersTyping"
  @unsetChannel="unsetChannel"
)
</template>

<script>
import XPMessagesChannel from '~/components/pages/Messages/Channel'
import meta from '~/mixins/meta'

export default {
  name: 'PageMessagesChannel',
  components: { XPMessagesChannel },
  mixins: [meta],
  layout: 'messages',
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
}
</script>
