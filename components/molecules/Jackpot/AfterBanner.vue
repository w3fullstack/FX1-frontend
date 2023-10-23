<template lang="pug">
.xp-afterbanner
  .circle-1
  .all-other
    ConsumerSection
    TicketCountSection
</template>

<script>
export default {
  name: 'JackpotAfterBanner',
  components: {
    ConsumerSection: () =>
      import('~/components/molecules/Jackpot/ConsumerSection.vue'),
    TicketCountSection: () =>
      import('~/components/molecules/Jackpot/TicketCountSection.vue'),
  },
}
</script>

<style lang="scss" scoped>

.xp-afterbanner::v-deep {
  position: relative;

  .all-other {
    padding-left:5%;
    padding-right:5%;
  }

  // For Mobile
  @include max-width(500px) {
    
    .all-other {
      padding-left:0%;
      padding-right:0%;
    }
  }

  .circle-1 {
    top: -112%;
    position: absolute;
    background-image: url('~assets/images/Token/CirclesAndLight2.png');
    background-position: top;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
    opacity: 0.4;
    zoom: 1;

    // Tablet
    @include max-width(1021px) {
      zoom: 0.9;
    }

    // Mobile
    @include max-width(500px) {
      top: -55.4%;
      background-size: 150% !important;
    }
    @include max-width(361px) {
      top: -54.4%;
      background-size: 150% !important;
    }
  }

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
