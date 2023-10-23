import { GiphyFetch } from '@giphy/js-fetch-api'
import memoize from 'lodash/memoize'

const gf = new GiphyFetch(process.env.GIPHY_API_KEY)
export const state = () => {
  return {
    gifs: [],
    filteredGifs: [],
    selected: null
  }
}

const RESULT_LIMIT = 28

export const mutations = {
  setGifs(state, gifs) {
    state.gifs = gifs
  },
  setFilteredGifs(state, gifs) {
    state.filteredGifs = gifs
  },
  setSelectedGif(state, gif) {
    state.selected = gif
  },
  clearSelectedGif(state) {
    state.selected = null
  }
}

export const actions = {
  loadGifs: memoize(async function ({ commit }, stickers) {
    const options = { limit: RESULT_LIMIT, type: stickers ? 'stickers' : 'gifs' }
    const { data } = await gf.trending(options)
    commit('setGifs', data)
  }),
  searchGifs: memoize(async function ({ commit, state }, payload) {
    const { value, limit = RESULT_LIMIT, offset, stickers } = payload
    const options = { limit, offset, type: stickers ? 'stickers' : 'gifs' }
    const { data } = await gf.search(value, options)
    commit('setFilteredGifs', [...state.filteredGifs, ...data])
  }),
  clearSelectedGif({ commit }) {
    commit('clearSelectedGif')
  }
}

export const getters = {
  getGifs: state => state.gifs,
  getFilteredGifs: state => state.filteredGifs,
  getSelectedGif: state => state.selected
}
