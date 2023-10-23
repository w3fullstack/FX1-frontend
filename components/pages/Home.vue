<template lang="pug">
.xp-home
  XOHomeBanner
  XOHomeAfterBanner
  XOConnectAPP
  XOHomeCatalogs
  XOHomeClubs
  XOHomeWhoIs
  XOHomeWaitingFor
</template>

<script>
export default {
  name: 'XPHome',
  components: {
    XOHomeBanner: () => import('~/components/organisms/v2/Home/Banner.vue'),
    XOHomeAfterBanner: () =>
      import('~/components/organisms/v2/Home/AfterBanner.vue'),
    XOConnectAPP: () => import('~/components/organisms/v2/Home/ConnectAPP.vue'),
    XOHomeCatalogs: () => import('~/components/organisms/v2/Home/Catalogs.vue'),
    XOHomeClubs: () => import('~/components/organisms/Home/Clubs.vue'),
    XOHomeWhoIs: () => import('~/components/organisms/v2/Home/WhoIs.vue'),
    XOHomeWaitingFor: () =>
      import('~/components/organisms/v2/Home/WaitingFor.vue'),
  },
}
</script>

<style lang="scss" scoped>
.xp-home::v-deep {
  background: linear-gradient(0deg, #000 0%, rgba(0, 0, 0, 0) 71.01%), #08252c;
  min-height: calc(100vh - 683px);

  h3 {
    font-size: 1.5714rem;
    line-height: 2.4286rem;
    letter-spacing: -0.66px;
  }

  @media screen and (min-width: 768px) and (max-width: 1439px) {
    .container {
      padding: 0 40px;
    }
  }
  @media screen and (max-width: 1439px) {
    h1 {
      font-size: 48px;
      line-height: 60px;
      margin-bottom: 33px;
    }
    h2 {
      font-size: 28px;
      line-height: 36px;
      margin-bottom: 20px;
    }
    p.txt-subtitle {
      font-size: 2rem;
      line-height: 36px;
    }
    p.txt-title {
      font-size: 36px;
      line-height: 44px;
    }
  }
  @media screen and (max-width: 1023px) {
  }
  @media screen and (max-width: 767px) {
    h1 {
      font-size: 32px;
      line-height: 36px;
    }
    h2 {
      font-size: 20px;
      line-height: 26px;
    }
    p.txt-title {
      font-size: 28px;
    }
    p.txt-subtitle {
      font-size: 20px;
      line-height: 26px;
    }
    p.txt-intro {
      font-size: 14px;
      line-height: 20px;
    }
    p.txt-subtitle-1 {
      font-size: 32px;
      line-height: 36px;
    }
  }
}
</style>
