<template lang="pug">
XMLiveSlider(
  v-if="streams.length > 0"
  :name="name"
  :slides="streams"
  :nextId="next"
  :childStatus="status"
  :upcoming="status === 'upcoming'"
  @next-slider="getSports"
)
</template>

<script>
import XMLiveSlider from '~/components/molecules/Live/Slider.vue'

export default {
  name: 'XOLiveRecommendedSlider',
  components: { XMLiveSlider },
  props: {
    name: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      isRetrieving: true,
      streams: [],
      next: null,
    }
  },
  watch: {
    async "$store.state.app.activeSports"() {
      this.streams = []
      await this.getSports(this.status, null, 10, true)
    },
    async "$store.state.app.activePartners"() {
      this.streams = []
      await this.getSports(this.status, null, 10, true)
    }
  },
  async created() {
    await this.getSports(this.status, null, 10, true)
  },
  methods: {
    async getSports(status, next, count, isFirstTimeCall) {
      const inputParam = this.createInput(status, next, count)
      try {
        this.isRetrieving = true
        const { getGames: { items, next } } = await this.$api.getGames(inputParam)
        this.isRetrieving = false
        this.updateListData(items, next, isFirstTimeCall)
      } catch (error) {
         error?.response?.errors.forEach((error) => {
           this.$toast.error(error.message, {
             duration: 5000,
             position: 'bottom-left',
             className: 'fx1-success',
             iconPack: 'mdi',
             icon: 'alert-circle-outline',
           })
         })
      } finally {
        this.isRetrieving = false
      }
    },
    updateListData(items, next, isFirstTimeCall) {
      this.streams = isFirstTimeCall ? items : this.streams.concat(items)
      this.next = next
    },
    createInput(status, next, count) {
      const myParam = {
        next,
        count,
        type: status,
      }
      if(this.$store.state.app.activeSports.length > 0) {
        myParam.leagueCodes = this.$store.state.app.activeLeagues
      }
      if(this.$store.state.app.activePartners.length > 0) {
        myParam.partnerNames = this.$store.state.app.activePartnersString
      }
      return myParam
    }
  }
}
</script>
