<template lang="pug">
XPAccount
</template>

<script>
export default {
  name: 'PageAccount',
  components: {
    XPAccount: () => import('~/components/pages/Account.vue'),
  },
  layout: 'account'
}
</script>
