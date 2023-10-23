<template lang="pug">
.xa-messages-encryped-popup
  nuxt-img.shield(
    src="/v2/Messages/shield-tick.svg",
    width="28",
    height="28",
    @click="showPopup()"
  )
</template>

<script>
import dialogs from '~/mixins/dialogs'

export default {
  name: 'XAMessagesEncryptedSplash',
  mixins: [dialogs],
  methods: {
    showPopup() {
      this.fnEncryptedChatDialog()
    },
  },
}
</script>

<style lang="scss" scoped>
.xa-messages-encryped-popup {
  position: sticky;
  top: 0;
  z-index: 1;
  .shield {
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
  }
}
</style>