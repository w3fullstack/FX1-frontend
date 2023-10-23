<template lang="pug">
.xm-locker-room-header-left(:class="isLoggedIn && 'is-logged-in'")
  .logo: nuxt-link(to="/"): img(src="~assets/images/logo.svg", alt="FX1")
</template>

<script>
export default {
  name: 'XMLockerRoomHeaderLeft',
}
</script>

<style lang="scss" scoped>
.xm-locker-room-header-left::v-deep {
  width: 106px;
  margin-top: auto;
  margin-bottom: auto;

  .logo {
    margin-top: 2px;
    a {
      img {
        width: 55px;
      }
    }
  }
  @media screen and (max-width: 767px) {
    width: 55px;
  }
}
</style>
