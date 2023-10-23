<template lang="pug">
XPMessages
</template>

<script>
import XPMessages from '~/components/pages/Messages.vue'
import meta from '~/mixins/meta'

export default {
  name: 'PageMessages',
  components: { XPMessages },
  mixins: [meta],
  layout: 'messages',
}
</script>
