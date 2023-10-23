<template lang="pug" />

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'PageUser',
  layout: 'blank',
  computed: {
    ...mapGetters({
      getActionHandler: 'auth/getActionHandler',
    }),
  },
  async mounted() {
    const { error } = this.getActionHandler
    const { mode, oobCode: actionCode } = this.$route.query

    if (error) {
      await this.$router.push({
        path: '/signin',
      })

      this.$toast.error(error, {
        duration: 8000,
        position: 'bottom-left',
        className: 'fx1-error',
        iconPack: 'mdi',
        icon: 'alert-circle-outline',
      })

      return
    }

    switch (mode) {
      case 'resetPassword': {
        await this.$router.push({
          path: `/create-new-password?c=${actionCode}`,
        })
        break
      }
      case 'verifyAndChangeEmail': {
        try {
          const {
            data: { email },
          } = await this.$store.dispatch('auth/verifyEmail', {
            actionCode,
          })

          await this.$api.confirmEmailChange({
            input: {
              email,
            },
          })

          await this.$router.push({
            path: '/account/settings',
          })

          this.$toast.success('The email address was successfully changed!', {
            duration: 5000,
            position: 'bottom-left',
            className: 'fx1-success',
            iconPack: 'mdi',
            icon: 'alert-circle-outline',
          })
        } catch (error) {
          await this.$router.push({
            path: '/',
          })

          this.$toast.error(error.message, {
            duration: 5000,
            position: 'bottom-left',
            className: 'fx1-error',
            iconPack: 'mdi',
            icon: 'alert-circle-outline',
          })
        }
        break
      }
    }
  },
  methods: {
    ...mapActions({
      authLogOut: 'auth/authLogOut',
    }),
  },
}
</script>
