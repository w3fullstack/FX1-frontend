<template lang="pug">
XPHome
</template>

<script>
import meta from '~/mixins/meta'

export default {
  name: 'PageIndex',
  components: {
    XPHome: () => import('~/components/pages/Home'),
  },
  mixins: [meta],
  // async beforeCreate() {
  //   const isLoggedIn = this.$store.state.auth.isLoggedIn
  //   const onHomePageLoad = this.$store.state.app.onHomePageLoad

  //   if (isLoggedIn && !onHomePageLoad) {
  //     const {
  //       Me: { Supporting },
  //     } = await this.$api.getMyProfileSupporting()

  //     if (!Supporting) return
  //     if (Supporting.length) {
  //       this.$router.push({
  //         path: `/locker-room/${Supporting[0]?.slug}/${Supporting[0]?.defaultChannelSlug}`,
  //       })
  //       return
  //     }

  //     this.$router.push({
  //       path: '/locker-room/explore',
  //     })
  //   }
  // },
  async beforeCreate() {
    const { action, group } = this.$route.query

    if (action && group) {
      if (action === 'prgroup') {
        const gameId = Number(group.split(':')[1])
        const { getGame: {sport, leagueCode, team1DisplayName, team2DisplayName} } = await this.$api.getGame({ gameID: gameId })
        if (!sport || !leagueCode || !team1DisplayName || !team2DisplayName) return

        const redirectUrl = `${sport}/${leagueCode}/${team1DisplayName}-vs-${team2DisplayName}/${gameId}?privateShow=true`

        if (!this.isLoggedIn) {
          await this.$router.push({
            path: '/signin',
            query: {
              next: redirectUrl,
            },
          })
          return
        }
        await this.$router.push({
          path: redirectUrl,
        })
      } else if (action === 'priInvite') {
        await this.$router.push({
          path: '/messages',
          query: this.$route.query,
        })
      }
    }
  },
  created() {
    this.metaTitle = 'Show the world who you support - FX1'
  },
  mounted() {
    const params = { pageName: 'Home', isLoggedIn: this.isLoggedIn }
    this.$mixpanelClient.trackViewPage(params)
  },
}
</script>
