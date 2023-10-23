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
  border-top: 1px solid #424242;
  font-size: 12px;
  line-height: 14px;
  letter-spacing: -0.1px;
  color: #839295;
  text-align: center;
  padding: 20px 0;
}
</style>
