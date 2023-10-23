<template lang="pug">
.xo-default-footer-get-app
  .app-logo.row
    .col: a.app-store(
      href="https://apps.apple.com/us/app/fx1/id1626034650",
      target="_blank"
    ): img(
      src="~assets/images/Jackpot/appstore.svg",
      alt="App Store"
    )
    .col: a.playstore(
      href="https://play.google.com/store/apps/details?id=io.fx1.sports",
      target="_blank"
    ): img(
      src="~assets/images/Jackpot/googleplay.svg",
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

  .col {
    margin-right: 20px;
  }

  @include max-width(1025px) {
    p {
      max-width: 80%;
    }
  }

  @include max-width(769px) {
    width: 100%;
    margin-bottom: 30px;
    padding: 15px;
  }

  h3 {
    font-weight: 400;
    font-size: 44px;
    line-height: 49px;
    letter-spacing: 0.32px;
    margin-bottom: 12px;
  }

  p {
    font-weight: 100;
    font-size: 18px;
    line-height: 32px;
    color: $white;
  }

  .app-logo {
    margin-top: 20px;

    .app-store {
      margin-right: 15px;

      img {
        @include max-width(767px) {
          max-width: 150px;
        }
      }
    }

    .playstore {
      img {
        @include max-width(767px) {
          max-width: 150px;
        }
      }
    }
  }
}
</style>
