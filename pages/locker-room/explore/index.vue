<template lang="pug">
XPExploreClubs(
  :isLoading="isLoading",
  :sportsData="sportsData"
)
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import meta from '~/mixins/meta'

export default {
  name: 'PageLockerRoomCommunities',
  components: {
    XPExploreClubs: () => import('~/components/pages/ExploreClubs'),
  },
  mixins: [meta],
  layout: 'locker-room',
  data() {
    return {
      isLoading: true,
      sportsData: [],
    }
  },
  computed: {
    ...mapFields('locker-room', ['lockerRoomActive']),
  },
  created() {
    this.metaTitle = 'Explore to find your sporting league or club - FX1'
  },
  async mounted() {
    await this.fnGetSports()
    this.lockerRoomActive = null
    const params = { pageName: 'Locker room', isLoggedIn: this.isLoggedIn }
    this.$mixpanelClient.trackViewPage(params)
  },
  methods: {
    async fnGetSports () {
      try {
        const {
          getSports: { items },
        } = await this.$api.getSports()

        this.sportsData = items
      } catch (error) {
      } finally {
        this.isLoading = false
      }
    }
  },
}
</script>
