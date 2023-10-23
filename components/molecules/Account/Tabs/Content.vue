<template lang="pug">
.xm-account-tabs-content(v-if="isShowContent")
  nuxt-child
</template>

<script>
export default {
  name: 'XMAccountTabsContent',
  computed: {
    isShowContent() {
      return this.$route.name !== 'account'
    },
  },
}
</script>

<style lang="scss" scoped>
.xm-account-tabs-content::v-deep {
  width: 100%;
  padding: 40px 28px;
  @include min-width(769px) {
    border-left: 1px solid $tertiary;
  }
  @include max-width(768px) {
    padding: 24px 20px;
  }
}
</style>