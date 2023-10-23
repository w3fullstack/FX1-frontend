import { getField, updateField } from 'vuex-map-fields'

export const state = () => {
  return {
    userID: null,
    userUID: null,
    userName: null,
    userAvatar: null,
    userEmail: null,
    unverifiedEmailAddress: null,
    isEmailVerified: null,
    isSocialAccount: null,
    unseenNotifications: null,
    encryptionKey: null,
  }
}

export const getters = {
  getField,
  getUserID(state) {
    return state.userID
  },
  getUserUID(state) {
    return state.userUID
  },
  getUserName(state) {
    return state.userName
  },
  getUserEmail(state) {
    return state.userEmail
  },
  getUnverifiedEmailAddress(state) {
    return state.unverifiedEmailAddress
  },
  getIsEmailVerified(state) {
    return state.isEmailVerified
  },
  getIsSocialAccount(state) {
    return state.isSocialAccount
  },
  getUserAvatar(state) {
    return state.userAvatar
  },
  getUnseenNotifications(state) {
    return state.unseenNotifications
  },
  getEncryptionKey(state) {
    return state.encryptionKey
  },
}

export const mutations = {
  updateField,
  setUserID(state, data) {
    state.userID = data
  },
  setUserUID(state, data) {
    state.userUID = data
  },
  setUserName(state, data) {
    state.userName = data
  },
  setUserEmail(state, data) {
    state.userEmail = data
  },
  setUnverifiedEmailAddress(state, data) {
    state.unverifiedEmailAddress = data
  },
  setIsEmailVerified(state, data) {
    state.isEmailVerified = data
  },
  setIsSocialAccount(state, data) {
    state.isSocialAccount = data
  },
  setUserAvatar(state, data) {
    state.userAvatar = data
  },
  setUnseenNotifications(state, data) {
    state.unseenNotifications = data
  },
  setEncryptionKey(state, data) {
    state.encryptionKey = data
  },
  resetUserState(state) {
    for (const key in state) {
      state[key] = null
    }
  },
}

export const actions = {
  setUserID({ commit }, data) {
    commit('setUserID', data)
  },
  setUserUID({ commit }, data) {
    commit('setUserUID', data)
  },
  setUserName({ commit }, data) {
    commit('setUserName', data)
  },
  setUserEmail({ commit }, data) {
    commit('setUserEmail', data)
  },
  setUnverifiedEmailAddress({ commit }, data) {
    commit('setUnverifiedEmailAddress', data)
  },
  setIsEmailVerified({ commit }, data) {
    commit('setIsEmailVerified', data)
  },
  setIsSocialAccount({ commit }, data) {
    commit('setIsSocialAccount', data)
  },
  setUserAvatar({ commit }, data) {
    commit('setUserAvatar', data)
  },
  setUnseenNotifications({ commit }, data) {
    commit('setUnseenNotifications', data)
  },
  setEncryptionKey({ commit }, data) {
    commit('setEncryptionKey', data)
  },
}
