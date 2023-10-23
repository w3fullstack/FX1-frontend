import { getField, updateField } from 'vuex-map-fields'

export const state = () => {
  return {
    showOnlineMembers: false,
    onHomePageLoad: false,
    showLoader: true,
    activeSports: [],
    activeLeagues: [],
    activePartners: [],
    activePartnersString: '',
    activeSport: 'all',
    showLiveChat: true,
    selectedGameID: null,
    selectedGameEventRoom: null,
    onlineMembers: [],
  }
}

export const getters = {
  getField,
  getOnlineMembers(state) {
    return state.onlineMembers
  }
}

export const mutations = {
  updateField,
  updateSelectedGameID(state, value) {
    state.selectedGameID = value;
  },
  setSelectedGameEventRoom(state, value) {
    state.selectedGameEventRoom = value;
  },
  toggleActiveSport (state, value) {
    const index = state.activeSports.indexOf(value)
    if (index === -1) {
      state.activeSports.push(value)
    } else {
      state.activeSports.splice(index, 1)
    }

    if(state.activeSports.length > 0) {
      state.activeLeagues = state.activeSports.reduce((a, s) => {
        if (s === 'baseball') {
          a.push('mlb')
        } else if (s === 'basketball') {
          a.push(...'wnba,nba,ncaab'.split(','))
        } else if (s === 'ice-hockey') {
          a.push('nhl')
        } else if (s === 'soccer') {
          a.push(...'mls,epl,concacaf,efl,uefa'.split(','))
        } else if (s === 'mma') {
          a.push('ufc')
        } else if (s === 'nfl') {
          a.push('nfl')
        }

        return a
      }, [])
    } else {
      state.activeLeagues = []
    }
    return true
  },
  toggleActivePartner (state, value) {
    const index = state.activePartners.indexOf(value)
    if (index === -1) {
      state.activePartners.push(value)
    } else {
      state.activePartners.splice(index, 1)
    }

    if(state.activePartners.length > 0) {
      state.activePartnersString = state.activePartners.toString();
    }
    return true
  },
  setOnlineMembers(state, data) {
    state.onlineMembers = data
  },
}

export const actions = {
  setOnlineMembers({ commit }, data) {
    commit('setOnlineMembers', data)
  },
}