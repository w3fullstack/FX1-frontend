<template lang="pug">
.xp-token
  JackpotBanner
  JackpotAfterBanner
</template>

<script>
export default {
  name: 'XPJackpot',
  components: {
    JackpotBanner: () => import('~/components/molecules/Jackpot/Banner.vue'),
    JackpotAfterBanner: () => import('~/components/molecules/Jackpot/AfterBanner.vue'),
  },
}
</script>

<style lang="scss" scoped>
.xp-token::v-deep {
  background: linear-gradient(360deg, #000000 0%, rgba(0, 0, 0, 0) 71.01%),
linear-gradient(0deg, #08252C, #08252C);

  h2 {
    &.txt-lg {
      font-size: 5rem;
      line-height: 5.7143rem;
      letter-spacing: -2.1px;

      @include max-width(1023px) {
        font-size: 2.2857rem;
        line-height: 3.2857rem;
      }
    }
  }
}
</style>
