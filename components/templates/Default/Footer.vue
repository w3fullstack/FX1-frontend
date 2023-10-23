<template lang="pug">
.xt-default-footer
  .get-app-connect-container(v-if="$route.path != '/error'")
    .container.is-max-widescreen.foot-container
      .row.justify-between.foot-row 
        XODefaultFooterGetApp
        XODefaultFooterNavigation
  XODefaultFooterCopyright
</template>

<script>
export default {
  name: 'XTDefaultFooter',
  components: {
    XODefaultFooterGetApp: () =>
      import('~/components/organisms/Default/Footer/GetApp'),
    // XODefaultFooterConnect: () =>
    //   import('~/components/organisms/Default/Footer/Connect'),
    XODefaultFooterNavigation: () =>
      import('~/components/organisms/Default/Footer/Navigation'),
    XODefaultFooterCopyright: () =>
      import('~/components/organisms/Default/Footer/Copyright'),
  },
}
</script>

<style lang="scss" scoped>
.xt-default-footer::v-deep {
  background: $black;
  .get-app-connect-container {
    .foot-container {
      .foot-row {
        padding: 48px 0;
      }
    }
  }
  @media screen and (max-width: 1023px) {
    .get-app-connect-container {
      .foot-container {
        .foot-row {
          flex-flow: column;
          gap: 77px;
        }
      }
    }
  }
}
</style>
