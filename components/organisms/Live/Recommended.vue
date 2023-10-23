<template lang="pug">
.xo-live-streams(v-if="liveGames.length > 0 || upcomingGames.length > 0")
  h2 Recommended
  XMLiveSlider(
    v-if="liveGames.length > 0",
    name="Live Now",
    :slides="liveGames",
  )
  XMLiveSlider(
    v-if="upcomingGames.length > 0",
    name="Upcoming Streams",
    :slides="upcomingGames",
    :upcoming="true"
  )
</template>

<script>
import { mapState } from 'vuex'
import XMLiveSlider from '~/components/molecules/Live/Slider.vue'
import XOLoader from '~/components/atoms/Loader.vue'

export default {
  name: 'XOLiveRecommended',
  components: { XMLiveSlider, XOLoader },
  props: {
    games: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      leagueCodes: [
        'mlb',
        'wnba',
        'nba',
        'ncaab',
        'nhl',
        'mls',
        'epl',
        'concacaf',
        'efl',
        'uefa',
        'mvp',
        'nfl',
      ],
    }
  },
  computed: {
    ...mapState('app', ['activeLeagues']),
    liveGames() {
      return this.fnFilterGames('live') || []
    },
    upcomingGames() {
      return this.fnFilterGames('upcoming') || []
    }
  },
  methods: {
    fnFilterGames(type) {
      return this.games[type] && this.games[type].items.filter((g) => {
        if (this.activeLeagues.length) {
          if (this.activeLeagues.includes(g.leagueCode)) {
            return g
          } else {
            return null
          }
        }

        return g
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.xo-live-streams::v-deep {
  .XOLoader {
    z-index: 100;
    position: absolute;
  }
  margin-top: 30px;
  margin-bottom: 80px;

  @include max-width(1365px) {
    margin-top: 28px;
  }

  @include max-width(767px) {
    margin-top: 24px;
    margin-bottom: 66px;
  }

  h2 {
    letter-spacing: -2.1px;
    font-size: 32px;
    line-height: 1.8;

    @include min-width(768px) {
      font-size: 40px;
      line-height: 80px;
    }
  }
}
</style>
