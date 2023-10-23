<template lang="pug">
.xo-default-footer-copyright &copy; FX1 {{ year }}
</template>

<script>
export default {
  name: 'XODefaultFooterCopyright',
  computed: {
    year() {
      return new Date().getFullYear()
    },
  },
}
</script>

<style lang="scss" scoped>
.xo-default-footer-copyright::v-deep {
  position: relative;
  border-top: 1px solid $arsenic;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: -0.1px;
  color: #bdbdbd;
  text-align: center;
  padding: 28px 0;
  @media screen and (max-width: 767px) {
    padding: 22px 0;
    margin: 0 5px;
  }
}
</style>
