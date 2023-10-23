<!--suppress CssUnknownTarget -->
<template lang="pug">
.xo-home-waiting-for.row.items-center.justify-start
  .right-img-content
  .container.is-max-widescreen
    .left-section
      h1 What are you waiting for?
      h3.text-weight-light Sign up for free and join a small but growing community of avid sports fans. Stay up to date on feature releases.
      .actions
        b-button.items-center.justify-center.text-weight-medium(
          type="is-primary",
          tag="router-link",
          to="/signup?step=1"
        ) Create Account
</template>

<script>
export default {
  name: 'XOHomeWaitingFor',
}
</script>

<style lang="scss" scoped>
.xo-home-waiting-for {
  height: 1464px;
  overflow: hidden;
  background: $black;
  background-image: url('~assets/images/v2/Home/circles-and-light-1.svg');
  background-position: right center;
  background-repeat: no-repeat;
  position: relative;
  margin-top: -360px;
  .right-img-content {
    background-image: url('~assets/images/v2/Home/waiting-for_man.png');
    width: 826px;
    height: 1228px;
    background-repeat: no-repeat;
    position: absolute;
    right: 0;
    top: 85px;
  }

  .left-section {
    position: relative;
    max-width: 568px;
    h1 {
      margin-bottom: 28px;
    }
    h3 {
      text-shadow: 0px 4px 12px rgba(0, 0, 0, 0.4);
    }
    .actions {
      margin-top: 28px;
      .button {
        width: 251px !important;
        height: 76px !important;
        font-size: 20px;
        line-height: 28px;
        text-transform: uppercase;
        border-radius: 10px;
        box-shadow: $box-shadow-1;
        margin-right: unset !important;
        margin-left: unset !important;
      }
    }
  }
  @media screen and (max-width: 1439px) {
    background-size: 1000px;
    .right-img-content {
      background-size: 755px;
      right: -90px;
      top: 166px;
    }
    .left-section {
      max-width: 530px;
    }
  }
  @media screen and (max-width: 1023px) {
    background-size: 800px;
    .right-img-content {
      background-size: 550px;
      right: -260px;
      top: 301px;
    }
    .left-section {
      max-width: 368px;
    }
  }
  @media screen and (max-width: 767px) {
    background-image: url('~assets/images/v2/Home/circles-and-light-mobile.svg');
    background-size: cover;
    background-position: center;
    margin-top: -155px;
    align-items: flex-start;
    justify-content: center;
    .right-img-content {
      background-size: 500px;
      right: -160px;
      top: unset;
      bottom: -115px;
    }
    .container {
      display: flex;
      flex-flow: row;
      justify-content: center;
      margin-top: 250px;
      .left-section {
        h3 {
          font-size: 1rem;
          line-height: 20px;
        }
        .actions {
          .button {
            width: 205px !important;
            height: 46px !important;
            font-size: 1rem;
          }
        }
      }
    }
  }
  @media screen and (min-width: 420px) and (max-width: 767px) {
    background-image: none;
    background: $black;
  }
  @media screen and (max-width: 700px) {
    .right-img-content {
      right: -200px;
    }
  }
  @media screen and (max-width: 600px) {
    .right-img-content {
      right: -260px;
    }
  }

  @media screen and (max-width: 540px) {
    background-size: contain;
    .right-img-content {
      right: -289px;
    }
  }
  @media screen and (max-width: 450px) {
    .right-img-content {
      right: -305px;
    }
  }
  @media screen and (max-width: 375px) {
    .right-img-content {
      right: -343px;
    }
  }
}
</style>
