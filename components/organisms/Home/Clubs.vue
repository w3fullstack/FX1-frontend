<template lang="pug">
.xo-home-clubs
  .container.is-max-widescreen
    h1 Upcoming Games
    XOLiveRecommendedSlider(status="upcoming")
</template>

<script>
export default {
  name: 'XOHomeClubs',
  components: {
    XOLiveRecommendedSlider: () =>
      import('~/components/organisms/Live/RecommendedSlider'),
  },
}
</script>

<style lang="scss" scoped>
.xo-home-clubs::v-deep {
  background-color: black;
  background-image: url('~assets/images/v2/Home/gradient-1.svg');
  background-repeat: no-repeat;
  background-position: left 0 top -150px;
  padding: 100px 0;
  @media screen and (max-width: 1439px) {
    padding: 80px 0;
    h1 {
      margin-bottom: 0;
    }
    .xm-live-slider {
      margin: 0;
    }
  }
  @media screen and (max-width: 1023px) {
  }
  @media screen and (max-width: 767px) {
    padding: 50px 0;
  }
}
</style>
