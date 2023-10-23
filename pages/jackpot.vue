<template lang="pug">
XPJackpot
</template>

<script>
import meta from '~/mixins/meta'

export default {
  name: 'PageJackpot',
  components: {
    XPJackpot: () => import('~/components/pages/Jackpot'),
  },
  mixins: [meta],
  layout: 'jackpot-page',
  created() {
    this.metaTitle = '$FX1 Jackpot - FX1'
  },
  mounted() {
    const params = { pageName: 'Jackpot', isLoggedIn: this.isLoggedIn }
    this.$mixpanelClient.trackViewPage(params)
  },
}
</script>
