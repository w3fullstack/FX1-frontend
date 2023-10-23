<template lang="pug">
.xo-explore-clubs-fan-group(v-if="fanGroups.length")
  XMExploreClubsFanGroupSlider(:fan-groups="fanGroups")
</template>

<script>
import XMExploreClubsFanGroupSlider from '~/components/molecules/ExploreClubs/FanGroupSlider.vue'

export default {
  name: 'XOExploreClubsFanGroup',
  components: { XMExploreClubsFanGroupSlider },
  props: {
    sport: { type: Object, default: () => {} },
  },
  computed: {
    slug() {
      return this.sport?.slug || null
    },
    fanGroups() {
      return this.sport.FanGroupLockerRooms.items
    }
  },
}
</script>
