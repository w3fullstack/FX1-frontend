<template lang="pug">
XALoader(v-if="isLoading")
.xl-messages(v-else)
  XTLockerRoomHeader
  .row
    nuxt
</template>

<script>
import debounce from 'lodash/debounce'
import { mapActions } from 'vuex'
import XTLockerRoomHeader from '~/components/templates/LockerRoom/Header.vue'

export default {
  name: 'XLMessages',
  components: {
    XTLockerRoomHeader,
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

    // retrieving user details
    await this.fnRefreshToken()
    await this.fnCheckProfileDetails()
    await this.fnGetMyProfileDetails()

    this.isLoading = false
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
        error?.response?.errors.forEach((error) => {
          this.$toast.error(error.message, {
            duration: 5000,
            position: 'bottom-left',
            className: 'fx1-error',
            iconPack: 'mdi',
            icon: 'alert-circle-outline',
          })
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
.xl-messages::v-deep {
  color: $white;
  background-color: $secondary;

  .xt-locker-room-header {
    @include max-width(427px) {
      display: none;
    }
  }
}
</style>
