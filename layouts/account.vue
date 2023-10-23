<template lang="pug">
XALoader(v-if="isLoading")
.xl-account(v-else)
  XTDefaultHeader
  nuxt
</template>

<script>
import { mapActions } from 'vuex'
import debounce from 'lodash/debounce'

export default {
  name: 'XLAccount',
  components: {
    XTDefaultHeader: () =>
      import('~/components/templates/LockerRoom/Header.vue'),
    XALoader: () => import('~/components/atoms/Loader'),
  },
  data() {
    return {
      isLoading: true,
    }
  },
  async mounted() {
    if (!this.isLoggedIn) {
      this.$router.replace('/')
      this.isLoading = false
      return
    }

    const html = document.querySelector('html')
    html.style.overflowY = 'scroll'

    window.addEventListener('resize', this.onResize)

    this.fnRedirect()

    // retrieving user details
    await this.fnRefreshToken()
    await this.fnCheckProfileDetails()
    await this.fnGetMyProfileDetails()

    this.isLoading = false
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    ...mapActions({
      refreshToken: 'auth/refreshToken',
      authLogOut: 'auth/authLogOut',
    }),
    onResize() {
      this.fnRedirect()
    },
    fnRedirect() {
      if (window.innerWidth > 768 && this.$route.name === 'account') {
        this.$router.replace('/account/settings')
      }
    },
    async fnCheckProfileDetails() {
      try {
        const { Me } = await this.$api.getMyUserID()

        if (!Me) {
          this.authLogOut()
        }
      } catch (error) {
        this.$toast.error(error.message, {
          duration: 5000,
          position: 'bottom-left',
          className: 'fx1-error',
          iconPack: 'mdi',
          icon: 'alert-circle-outline',
        })
      }
    },
    async fnGetMyProfileDetails() {
      try {
        const { Me: { id, uid, username, name, emailAddress, isEmailVerified, isSocialAccount, unverifiedEmailAddress, Avatar, unseenNotifications, encryptionKey } } = await this.$api.getMyProfile()

        this.$store.dispatch('user/setUserID', id)
        this.$store.dispatch('user/setUserUID', uid)
        this.$store.dispatch('user/setUserName', username || name)
        this.$store.dispatch('user/setUserAvatar', Avatar?.PhotoURL)
        this.$store.dispatch('user/setUserEmail', emailAddress)
        this.$store.dispatch('user/setUnverifiedEmailAddress', unverifiedEmailAddress)
        this.$store.dispatch('user/setIsEmailVerified', isEmailVerified)
        this.$store.dispatch('user/setIsSocialAccount', isSocialAccount)
        this.$store.dispatch('user/setUnseenNotifications', unseenNotifications)
        this.$store.dispatch('user/setEncryptionKey', encryptionKey)
      
        this.fnSubscibeFCM(id)
      } catch (error) {
        this.$toast.error(error.message, {
          duration: 5000,
          position: 'bottom-left',
          className: 'fx1-error',
          iconPack: 'mdi',
          icon: 'alert-circle-outline',
        })
      }
    },
    fnSubscibeFCM: debounce(async function (topic) {
      await this.$fireMess.subscribeToTopic({ topicName: topic })
    }, 500),
    async fnRefreshToken() {
      try {
        await this.refreshToken()
      } catch (error) {}
    },
  },
}
</script>

<style lang="scss" scoped>
.xl-account::v-deep {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: $white;
  .__nuxt-error-page {
    position: relative;
    top: unset;
    left: unset;
    right: unset;
    bottom: unset;
    min-height: calc(100vh - 683px);
  }
}
</style>
