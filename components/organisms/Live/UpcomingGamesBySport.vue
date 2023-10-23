<template lang="pug">
.xo-upcoming-games-by-sport(v-if="isAnyGames")
  h2 Upcoming Games by Sport
  div(v-for="(game, index) in getGames", :key="game.code")
    XMLiveSlider(
      v-if="game.items.length > 0",
      :name="game.code",
      :slides="game.items",
      :upcoming="true"
    )
</template>

<script>
import { mapState } from 'vuex'
import XMLiveSlider from '~/components/molecules/Live/Slider.vue'

export default {
  name: 'XOUpcomingGamesBySport',
  components: { XMLiveSlider },
  props: {
    upcomingGames: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      leagueCodesData: [
        {
          code: 'MLB',
          name: 'Major League Baseball',
          items: [],
        },
        {
          code: 'NFL',
          name: 'NFL',
          items: [],
        },
        {
          code: 'WNBA',
          name: "Women's National Basketball Association",
          items: [],
        },
        {
          code: 'NBA',
          name: 'National Basketball Association',
          items: [],
        },
        {
          code: 'NCAAB',
          name: 'National Collegiate Athletic Association',
          items: [],
        },
        {
          code: 'NHL',
          name: 'National Hockey League',
          items: [],
        },
        {
          code: 'MLS',
          name: 'Major Soccer League',
          items: [],
        },
        {
          code: 'EPL',
          name: 'Premier League',
          items: [],
        },
        {
          code: 'CONCACAF',
          name: 'CONCACAF',
          items: [],
        },
        {
          code: 'EFL',
          name: 'EFL Championship',
          items: [],
        },
        {
          code: 'UEFA',
          name: 'UEFA Championship',
          items: [],
        },
        {
          code: 'MVP',
          name: 'Boxing',
          items: [],
        },
      ],
      leaguesBySport: [],
    }
  },
  computed: {
    ...mapState('app', ['activeLeagues']),
    isAnyGames() {
      return this.getGames.some((g) => g.items.length)
    },
    getGames() {
      return this.leagueCodesData
        .filter((l) => {
          if (this.activeLeagues.length) {
            if (this.activeLeagues.includes(l.code.toLowerCase())) {
              return l
            } else {
              return null
            }
          }

          return l
        })
        .map((a) => {
          const getGames = this.upcomingGames?.items?.filter(
            (g) => g.leagueCode === a.code.toLowerCase()
          )

          if (getGames) {
            a.items = getGames
          }

          return a
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.xo-upcoming-games-by-sport::v-deep {
  margin-top: 30px;
  margin-bottom: 80px;

  @include max-width(767px) {
    margin-bottom: 60px;
  }

  h2 {
    font-size: 32px;
    line-height: 1.8;
    letter-spacing: -2.1px;

    @include min-width(768px) {
      font-size: 40px;
      line-height: 80px;
    }
  }
}
</style>
