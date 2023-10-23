import { getField, updateField } from 'vuex-map-fields'
import find from 'lodash/find'

export const state = () => {
  return {
    notificationList: [],
    lockerRoomList: [],
    isMentions: 0,
    active: null,
  }
}

export const getters = {
  getField,
  getUnreadMessagesCount(state) {
    return state.notificationList
  },
  getMentions(state) {
    return state.isMentions
  },
  getNotificationActive(state) {
    return state.active
  },
}

export const mutations = {
  updateField,
  setMentions(state, data) {
    state.isMentions = data
  },
  setUnreadMessagesCount(state, data) {
    state.notificationList = data
  },
  setLockerRoomCount(state, data) {
    state.lockerRoomList = data
  },
  clearUnreadMessagesCount(state) {
    state.lockerRoomList.forEach((room) => {
      room.totalUnreadMessagesCount = 0
    })
  },
  clearActiveChannelNotification(state, slug) {
    if (!slug) return

    const notification = find(state.notificationList, { slug })
    if (notification) {
      notification.unreadMessagesCount = 0
    }
  },
  setNotificationActive(state, data) {
    state.active = data
  },
}

export const actions = {
  setMentions({ commit }, data) {
    commit('setMentions', data)
  },
  setUnreadMessagesCount({ commit }, data) {
    commit('setUnreadMessagesCount', data)
  },
  clearActiveChannelNotification({ commit }, slug) {
    commit('clearActiveChannelNotification', slug)
  },
  clearUnreadMessagesCount({ commit }) {
    commit('clearUnreadMessagesCount')
  },
  setLockerRoomCount({ commit }, data) {
    commit('setLockerRoomCount', data)
  },
  setNotificationActive({ commit }, data) {
    commit('setNotificationActive', data)
  },
}
