import { getField, updateField } from 'vuex-map-fields'

const RECENT_IMAGES_TO_KEEP = 12

export const state = () => {
  return {
    active: {},
    showEdit: false,
    deletedForEveryone: [],
    deleteForSelf: [],
    recentGifs: [],
    recentStickers: [],
    mode: 'chat',
    unread: false,
    room: null,
    newMembers: [],
    audioDeviceId: null,
    audioPermissionsGranted: false,
    audioDevices: [],
    videoDeviceId: null,
    videoPermissionsGranted: false,
    videoDevices: [],
    audioOutputDeviceId: null,
    audioOutputDevices: [],
  }
}

export const getters = {
  getField,
  getChatActive(state) {
    return state.active
  },
  getChatShowEdit(state) {
    return state.showEdit
  },
  getChatDeletedForEveryone(state) {
    return state.deletedForEveryone
  },
  getChatDeletedForSelf(state) {
    return state.deleteForSelf
  },
  getRecentGifs(state) {
    return state.recentGifs
  },
  getRecentStickers(state) {
    return state.recentStickers
  },
  getMode(state) {
    return state.mode
  },
  getUnread(state) {
    return state.unread
  },
  getAudioDeviceId(state) {
    return state.audioDeviceId
  },
  getVideoDeviceId(state) {
    return state.videoDeviceId
  },
  getRoom(state) {
    return state.room
  },
}

export const mutations = {
  updateField,
  setChatActive(state, data) {
    state.active = data
  },
  setChatShowEdit(state, data) {
    state.showEdit = data
  },
  setChatDeletedForEveryone(state, data) {
    if (state.deletedForEveryone.includes(data)) return
    state.deletedForEveryone.push(data)
  },
  setChatDeletedForSelf(state, data) {
    if (state.deleteForSelf.includes(data)) return
    state.deleteForSelf.push(data)
  },
  setRecentGifs(state, data) {
    const itemIndex = state.recentGifs.findIndex((item) => item.id === data.id)
    if (itemIndex === 0) return
    else if (itemIndex > 0) {
      state.recentGifs.splice(itemIndex, 1)
    }
    state.recentGifs.unshift(data)
    state.recentGifs.splice(RECENT_IMAGES_TO_KEEP, state.recentGifs.length)
  },
  setRecentStickers(state, data) {
    const itemIndex = state.recentStickers.findIndex(
      (item) => item.id === data.id
    )
    if (itemIndex === 0) return
    else if (itemIndex > 0) {
      state.recentStickers.splice(itemIndex, 1)
    }
    state.recentStickers.unshift(data)
    state.recentStickers.splice(
      RECENT_IMAGES_TO_KEEP,
      state.recentStickers.length
    )
  },
  setMode(state, data) {
    state.mode = data
  },
  setUnread(state, data) {
    state.unread = data
  },
  setAudioDeviceId(state, data) {
    state.audioDeviceId = data
  },
  setVideoDeviceId(state, data) {
    state.videoDeviceId = data
  },
  setRoom(state, data) {
    state.room = data
  },
  clearChatDeleted(state) {
    state.deletedForEveryone = []
    state.deleteForSelf = []
  },
  setAudioPermissionsGranted(state, data) {
    state.audioPermissionsGranted = data
  },
  setVideoPermissionsGranted(state, data) {
    state.videoPermissionsGranted = data
  }
}

export const actions = {
  setChatActive({ commit }, data) {
    commit('setChatActive', data)
  },
  setChatShowEdit({ commit }, data) {
    commit('setChatShowEdit', data)
  },
  setChatDeletedForEveryone({ commit }, data) {
    commit('setChatDeletedForEveryone', data)
  },
  setChatDeletedForSelf({ commit }, data) {
    commit('setChatDeletedForSelf', data)
  },
  setRecentGifs({ commit }, data) {
    commit('setRecentGifs', data)
  },
  setRecentStickers({ commit }, data) {
    commit('setRecentStickers', data)
  },
  setMode({ commit }, data) {
    commit('setMode', data)
  },
  setUnread({ commit }, data) {
    commit('setUnread', data)
  },
  setAudioDeviceId({ commit }, data) {
    commit('setAudioDeviceId', data)
  },
  setVideoDeviceId({ commit }, data) {
    commit('setVideoDeviceId', data)
  },
  setRoom({ commit }, data) {
    commit('setRoom', data)
  },
  clearChatDeleted({ commit }) {
    commit('clearChatDeleted')
  },
}
