import {
  GoogleAuthProvider,
  EmailAuthProvider,
  getAuth,
  signInWithPopup,
  getAdditionalUserInfo,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  updatePassword as firebaseUpdatePassword,
  confirmPasswordReset,
  reauthenticateWithCredential,
  linkWithPopup,
  unlink,
  checkActionCode,
  applyActionCode,
} from 'firebase/auth'
import { decode } from 'jsonwebtoken'

export const state = () => {
  return {
    isLoggedIn: false,
    uid: null,
    displayName: null,
    email: null,
    token: null,
    tokenExpiry: null,
    providerData: null,
    actionHandler: {},
  }
}

export const getters = {
  getIsLoggedIn(state) {
    return state.isLoggedIn
  },
  getAuthToken(state) {
    return state.token
  },
  getAuthEmail(state) {
    return state.email
  },
  getProviderData(state) {
    return state.providerData
  },
  getActionHandler(state) {
    return state.actionHandler
  },
}

export const mutations = {
  setUser(state, user) {
    if (!user) {
      state.uid = null
      state.displayName = null
      state.email = null
      state.token = null
      state.providerData = null
      state.tokenExpiry = null
      state.isLoggedIn = false
      state.actionHandler = {}
      return
    }

    const { uid, email, displayName, providerData, token } = user
    state.uid = uid
    state.displayName = displayName
    state.email = email
    state.token = token
    state.providerData = providerData
    state.tokenExpiry = token ? decode(token)?.exp : null
    state.isLoggedIn = !!token
  },
  clearAuthDetails(state) {
    state.isLoggedIn = false
    state.uid = null
    state.displayName = null
    state.email = null
    state.token = null
    state.tokenExpiry = null
  },
  setActionHandler(state, action) {
    state.actionHandler = action
  },
}

export const actions = {
  onAuthStateChangedAction({ commit }, { authUser, idToken }) {
    if (!authUser) {
      commit('setUser', null)
      return
    }

    const { uid, email, emailVerified, displayName, providerData, photoURL } =
      authUser
    const token = idToken || authUser?.auth?.currentUser?.accessToken

    if (!token) {
      commit('setUser', null)
      return
    }

    commit('setUser', {
      uid,
      email,
      emailVerified,
      displayName,
      photoURL,
      providerData,
      token,
    })
  },
  // eslint-disable-next-line no-empty-pattern
  async authSignupWithEmail({}, { email, password }) {
    try {
      const auth = getAuth()
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const additionalUserInfo = getAdditionalUserInfo(result)
      return { result, additionalUserInfo }
    } catch (error) {
      throw new Error(error)
    }
  },
  // eslint-disable-next-line no-empty-pattern
  async authLoginWithEmail({}, { email, password }) {
    try {
      const auth = getAuth()
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      throw new Error(error)
    }
  },
  async authLoginWithGoogle() {
    const provider = new GoogleAuthProvider()
    const auth = getAuth()

    try {
      const result = await signInWithPopup(auth, provider)
      const additionalUserInfo = getAdditionalUserInfo(result)
      return { result, additionalUserInfo }
    } catch (error) {
      throw new Error(error)
    }
  },
  async authLogOut({ commit, dispatch }) {
    const auth = getAuth()

    try {
      await signOut(auth)
      await dispatch('locker-room/clearLockerRoomSupporting', [], {
        root: true,
      })
      await dispatch('user/resetUserState', null, { root: true })
      await dispatch('user/setUserID', null, { root: true })
      await dispatch('user/setUserName', null, { root: true })
      await dispatch('user/setUserAvatar', null, { root: true })
      await dispatch('locker-room/clearLockerRoomSupporting', [], {
        root: true,
      })
      await dispatch('sports/setSportsList', [], { root: true })
      await dispatch('lockerRoom/setLockerRoomSupporting', [], { root: true })

      commit('setUser', null)
    } catch (error) {
      throw new Error(error)
    }
  },
  async refreshToken({ dispatch }) {
    const auth = getAuth()
    const authUser = auth.currentUser

    if (!authUser) return
    const idToken = await authUser.getIdToken()
    await dispatch('onAuthStateChangedAction', {
      authUser,
      idToken,
    })

    return { idToken }
  },
  // eslint-disable-next-line no-empty-pattern
  async forgotPassword({}, { email }) {
    const auth = getAuth()

    try {
      return await sendPasswordResetEmail(auth, email)
    } catch (error) {}
  },
  // eslint-disable-next-line no-empty-pattern
  async checkActionCode({}, { actionCode }) {
    const auth = getAuth()

    try {
      return await verifyPasswordResetCode(auth, actionCode)
    } catch (error) {
      throw new Error(error)
    }
  },
  // eslint-disable-next-line no-empty-pattern
  async resetPassword({}, { actionCode, password }) {
    const auth = getAuth()

    try {
      await confirmPasswordReset(auth, actionCode, password)
    } catch (error) {
      throw new Error(error)
    }
  },
  async updatePassword(_, { oldPassword, newPassword }) {
    const auth = getAuth()

    try {
      const credentials = EmailAuthProvider.credential(
        auth.currentUser.email,
        oldPassword
      )

      await reauthenticateWithCredential(auth.currentUser, credentials)
      await firebaseUpdatePassword(auth.currentUser, newPassword)
    } catch (error) {
      throw new Error(error)
    }
  },
  async verifyEmail(_, { actionCode }) {
    const auth = getAuth()

    try {
      const data = await checkActionCode(auth, actionCode)
      await applyActionCode(auth, actionCode)

      return data
    } catch (error) {
      throw new Error(error)
    }
  },
  unlinkSocialProvider(_, providerId) {
    const auth = getAuth()

    try {
      return unlink(auth.currentUser, providerId)
    } catch (error) {
      throw new Error(error)
    }
  },
  async connectGoogleAccount() {
    const provider = new GoogleAuthProvider()
    const auth = getAuth()

    try {
      await linkWithPopup(auth.currentUser, provider)
    } catch (error) {
      const alreadyUse =
        'Firebase: this credential is already associated with a different user account. (auth/credential-already-in-use).'
      if (error.message === alreadyUse) {
        throw new Error('This Google account is already in use')
      } else {
        throw new Error(error)
      }
    }
  },
  clearAuthDetails({ commit }) {
    commit('clearAuthDetails')
  },
  setActionHandler({ commit }, data) {
    commit('setActionHandler', data)
  },
}
