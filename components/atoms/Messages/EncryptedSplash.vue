<template lang="pug">
.xa-messages-encryped-splash
  .splash
    nuxt-img(
      src="/v2/Messages/shield-tick.svg",
      width="24",
      height="24"
    )
    p
      | Only you and the people your chatting with can read your messages.
      | We use end-to-end encryption for your safety and privacy
</template>

<script>
export default {
  name: 'XAMessagesEncryptedSplash',
}
</script>

<style lang="scss" scoped>
.xa-messages-encryped-splash {
  .splash {
    margin-inline: auto;
    max-width: 500px;
    padding: 12px 20px;
    background-color: $secondary;
    border-radius: 8px;

    display: grid;
    grid-template-columns: 24px 1fr;
    grid-template-rows: 1fr;
    gap: 12px;
  }
}
</style>
