<template lang="pug">
.xo-default-footer-get-app.flex-column
  .logo
    img(src="~assets/images/logo.svg", width="100", height="43", alt="FX1")
  .app-logo.row
    a.app-store(
      href="https://apps.apple.com/us/app/fx1/id1626034650",
      target="_blank"
    ): img(
      src="~assets/images/v2/Home/appstore.svg",
      alt="App Store"
    )
    a.playstore(
      href="https://play.google.com/store/apps/details?id=io.fx1.sports",
      target="_blank"
    ): img(
      src="~assets/images/v2/Home/googleplay.svg",
      alt="Playstore"
    )
</template>

<script>
export default {
  name: 'XODefaultFooterGetApp',
}
</script>

<style lang="scss" scoped>
.xo-default-footer-get-app::v-deep {
  gap: 34px;
  .app-logo {
    flex-flow: row;
    gap: 32px;
    img {
      max-width: 159px;
      max-height: 46px;
      @include max-width(767px) {
        max-width: 150px;
      }
    }
  }
  @media screen and (max-width: 1439px) {
    gap: 22px;
    .app-logo {
      flex-flow: column;
      gap: 24px;
      img {
        width: 150px;
        height: 43px;
      }
    }
  }
  @media screen and (max-width: 1023px) {
    flex-flow: row;
    justify-content: space-between;
    .app-logo {
      flex-flow: row;
    }
  }
  @media screen and (max-width: 767px) {
    flex-flow: column;
    align-items: center;
    justify-content: flex-start;
    gap: 30px;
    .app-logo {
      justify-content: space-around;
      img {
        width: 166px;
        height: 43px;
      }
    }
  }
}
</style>
