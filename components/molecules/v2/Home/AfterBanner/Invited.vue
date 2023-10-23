<template lang="pug">
.home-after-banner-invited 
  .msg-title 
    span You are invited!
    img(src="~/assets/images/v2/Home/close-icon_24px.svg")
  .content 
    span Tommy invited you to join 'Detroit Tigers' group.
    .btn JOIN
</template>
<script>
export default {
  name: 'HomeAfterBannerInvited',
}
</script>
<style lang="scss" scoped>
.home-after-banner-invited {
  width: 257px;
  height: 150px;
  position: absolute;
  top: 48%;
  left: -40%;
  border-radius: 6px;
  border: 0.75px solid var $police-blue;
  background: $secondary_b;
  box-shadow: 5px 3px 13px 0px rgba(0, 0, 0, 0.1),
    20px 13px 24px 0px rgba(0, 0, 0, 0.09),
    45px 30px 32px 0px rgba(0, 0, 0, 0.05),
    80px 53px 38px 0px rgba(0, 0, 0, 0.01), 125px 83px 42px 0px rgba(0, 0, 0, 0);
  display: flex;
  flex-flow: column;
  padding: 18px 12px;
  justify-content: space-between;
  .msg-title {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: flex-start;
    span {
      font-size: 14px;
      line-height: 1;
      font-weight: 500;
    }
  }
  .content {
    display: flex;
    flex-flow: column;
    gap: 18px;
    span {
      font-size: 13px;
      font-weight: 100;
      line-height: 1.3;
    }
    .btn {
      background: $primary;
      border-radius: 5px;
      width: 100%;
      text-align: center;
      font-size: 12px;
      line-height: 1;
      font-weight: 300;
      padding: 6px 0;
    }
  }
  @media screen and (max-width: 1439px) {
    width: 237px;
    height: 137px;
    top: 48%;
    left: -47%;
    .msg-title {
      span {
        font-size: 12px;
      }
      img {
        width: 16px;
        height: 16px;
      }
    }
    .content {
      gap: 14px;
      span {
        font-size: 12px;
        letter-spacing: 1.01;
      }
      .btn {
        font-size: 10px;
        padding: 6px 0;
      }
    }
  }
  @media screen and (max-width: 1023px) {
    width: 175px;
    height: 101px;
    padding: 12 px 8px;
    top: 63%;
    left: -42%;
    .msg-title {
      span {
        font-size: 10px;
      }
      img {
        width: 14px;
        height: 14px;
      }
    }
    .content {
      gap: 10px;
      span {
        font-size: 10px;
        letter-spacing: 1.01;
      }
      .btn {
        font-size: 8px;
        padding: 5px 0;
      }
    }
  }
  @media screen and (max-width: 767px) {
    width: 187px;
    height: 108px;
    top: 138px;
    left: 0;
  }
}
</style>
