<template lang="pug">
.xo-home-banner.row
  .container.is-max-widescreen.row.items-top.justify-center 
    .banner-content
      .banner-txt 
        p.txt-title.text-center.text-weight-medium 
          | Supercharged AI
          | Sports Betting
        p.txt-intro.text-center.text-weight-regular FX1 is a peer-to-peer sports betting exchange that uses data and AI to help you win more bets. Set your own odds, compete against your friends, and gain back control with our advanced insights and time-based subscription tools.

      .actions.row.justify-center
        b-button.items-center.justify-center.text-weight-medium(
          type="is-primary",
          tag="router-link",
          to="/signup?step=1"
        ) Create Account
</template>

<script>
export default {
  name: 'XOHomeBanner',
}
</script>

<style lang="scss" scoped>
.xo-home-banner {
  height: 1144px;
  overflow: hidden;
  background-image: url('~assets/images/v2/Home/circles-and-light.svg');
  background-repeat: no-repeat;
  background-position: center top;
  .banner-content {
    padding-top: 204px;
    .banner-txt {
      max-width: 673px;
      p.txt-intro {
        padding: 28px 0;
        margin: 0 auto;
        max-width: 521px;
        opacity: 0.6;
      }
    }
    .actions {
      margin: 12px auto !important;
      .button {
        width: 251px !important;
        height: 76px !important;
        margin-right: unset !important;
        margin-left: unset !important;
        font-size: 20px;
        line-height: 28px;
        text-transform: uppercase;
        border-radius: 10px;
        box-shadow: $box-shadow-1;
      }
    }
  }
  @media screen and (max-width: 1439px) {
    .banner-content {
      .banner-txt {
        max-width: 512px;
        p.txt-title {
          font-size: 3.428rem;
          letter-spacing: 0.96px;
          line-height: normal;
        }
      }
      .actions {
        margin: 8px auto !important;
        .button {
          height: 66px !important;
          font-size: 18px;
        }
      }
    }
  }
  @media screen and (max-width: 767px) {
    background-size: 1200px;
    .banner-content {
      .banner-txt {
        max-width: 345px;
        p.txt-title {
          font-size: 41px;
          letter-spacing: 0.82px;
          line-height: normal;
        }
        p.txt-intro {
          padding: 16px 0;
        }
      }
      .actions {
        margin: 20px auto !important;
        .button {
          height: 46px !important;
          width: 205px !important;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
