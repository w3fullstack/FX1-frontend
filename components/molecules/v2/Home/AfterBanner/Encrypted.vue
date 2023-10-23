<template lang="pug">
.home-after-banner-encrypted
  img(src="~/assets/images/v2/Home/security-icon.svg")
  span Your messagees are encrypted.
</template>
<script>
export default {
  name: 'HomeAfterBannerEncrypted',
}
</script>
<style lang="scss" scoped>
.home-after-banner-encrypted {
  position: absolute;
  top: 1%;
  left: -48%;
  width: 288px;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px 0;
  border-radius: 20px;
  border: 0.5px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.07);
  box-shadow: 5px 3px 14px 0px rgba(0, 0, 0, 0.1),
    22px 12px 25px 0px rgba(0, 0, 0, 0.09),
    49px 28px 34px 0px rgba(0, 0, 0, 0.05),
    86px 50px 40px 0px rgba(0, 0, 0, 0.01), 135px 78px 44px 0px rgba(0, 0, 0, 0);
  backdrop-filter: blur(5px);
  span {
    font-size: 15px;
    line-height: 1;
    font-weight: 100;
  }
  img {
    width: 16px;
    height: 20px;
  }
  @media screen and (max-width: 1439px) {
    width: 265px;
    padding: 14px 0;
    gap: 10px;
    top: 6%;
    left: -55%;
    img {
      width: 14px;
      height: 18px;
    }
    span {
      font-size: 14px;
    }
  }
  @media screen and (max-width: 1023px) {
    width: 195px;
    padding: 10px 0;
    gap: 6px;
    top: 0;
    left: -50%;
    img {
      width: 12px;
      height: 16px;
    }
    span {
      font-size: 10px;
    }
  }
  @media screen and (max-width: 767px) {
    width: 209px;
    top: 10px;
    left: 0;
  }
}
</style>
