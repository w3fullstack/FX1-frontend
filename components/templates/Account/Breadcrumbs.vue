<template lang="pug">
.xt-account-breadcrumbs
  .row.items-center
    .left-breadcrumbs.row.items-center
      .back.row(v-if="isShowBackArrow", @click.prevent="fnGoBack()")
        img(src="~assets/images/LockerRoom/back.svg")
      h2 {{ title }}
</template>

<script>
export default {
  name: 'XTAccountBreadcrumbs',
  props: {
    getRouterName: {
      type: Function,
      default: null,
    },
  },
  computed: {
    isShowBackArrow() {
      return this.$route.name !== 'account'
    },
    title() {
      return this.getRouterName(this.$route.name)
    },
  },
  methods: {
    fnGoBack() {
      this.$router.push({
        path: '/account',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.xt-account-breadcrumbs::v-deep {
	position: sticky;
  top: 80px;
  background-color: $tertiary;
  border-bottom: 1px solid $police-blue;
  padding: 10px 20px;
	z-index: 1;
  @include min-width(769px) {
    display: none;
  }
	@include max-width(767px) {
    top: 58px;
  }
  h2 {
    font-size: 22px;
  }
  .back {
    margin-right: 24px;
    cursor: pointer;
  }
}
</style>
