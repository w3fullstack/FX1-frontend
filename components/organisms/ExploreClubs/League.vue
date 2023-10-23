<template lang="pug">
.xo-explore-clubs-league(v-if="leagues.length")
  XMExploreClubsLeagueSlider(
    v-for="(league, index) in leagues",
    :key="index",
    :league="league"
  )
</template>

<script>
import XMExploreClubsLeagueSlider from '~/components/molecules/ExploreClubs/LeagueSlider.vue'

export default {
  name: 'XOExploreClubsLeague',
  components: {
    XMExploreClubsLeagueSlider,
  },
  props: {
    sport: { type: Object, default: () => {} },
  },
  computed: {
    slug() {
      return this.sport?.slug || null
    },
    leagues() {
      return this.sport.LockerRoomsByLeague
    },
  },
}
</script>
