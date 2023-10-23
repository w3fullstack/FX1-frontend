<template lang="pug">
.xl-token-default
  XTLockerRoomHeader
  nuxt
  XTDefaultFooter
</template>

<script>
import { mapActions } from 'vuex'
import debounce from 'lodash/debounce'

export default {
  name: 'XLToken',
  components: {
    XTDefaultFooter: () => import('~/components/templates/Default/Footer'),
    XTLockerRoomHeader: () =>
      import('~/components/templates/LockerRoom/Header'),
  },
  middleware: 'refreshToken',
  computed: {
    authToken() {
      return this.$store.state.auth.token || null
    },
  },
  watch: {
    isLoggedIn: {
      deep: true,
      handler() {
        this.fnGetMyProfileDetails()
      },
    },
    $route: {
      deep: true,
      handler() {
        // eslint-disable-next-line no-console
        console.log(
          `%cYou are not allowed here. Pasting anything here, will give hackers to access your account.`,
          'color: red; font-size: 32px; font-weight: 700;'
        )
      },
    },
    authToken: {
      deep: true,
      handler(value) {
        if (value) {
          this.fnGetMyProfileDetails()
        }
      },
    },
  },
  async mounted() {
    const html = document.querySelector('html')
    html.style.overflowY = 'scroll'

    // retrieving user details
    await this.fnRefreshToken()
    await this.fnCheckProfileDetails()
    await this.fnGetMyProfileDetails()
  },
  methods: {
    ...mapActions({
      refreshToken: 'auth/refreshToken',
      authLogOut: 'auth/authLogOut',
    }),
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
        if (!this.isLoggedIn) return

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
      if (!this.isLoggedIn) return
      try {
        await this.refreshToken()
      } catch (error) {}
    },
  },
}
</script>

<style lang="scss" scoped>
.xl-token-default {
  overflow: hidden;
}
.xl-token-default::v-deep {
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
