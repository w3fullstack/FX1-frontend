<template lang="pug">
.xa-my-avatar: XAAvatar(
  v-bind="$attrs",
  :name="name || userNameDefault",
  :image="avatarURL",
  v-if="name || avatarURL"
)
</template>

<script>
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'XAMyAvatar',
  components: {
    XAAvatar: () => import('~/components/atoms/Avatar'),
  },

  data() {
    return {
      userNameDefault: null,
      userAvatarDefault: null,
    }
  },

  computed: {
    ...mapFields('user', ['userName', 'userAvatar']),
    name() {
      return (
        this.userName ||
        this.$store.state.auth.displayName ||
        null
      )
    },
    avatarURL() {
      return this.userAvatar
    },
  },

  watch: {
    '$store.state.auth.token': {
      deep: true,
      handler() {
        this.userNameDefault = this.userName
        this.userAvatarDefault = this.userAvatar
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.xa-my-avatar::v-deep {
  .xa-avatar {
    @include max-width(767px) {
      width: 24px !important;
      height: 24px !important;
    }
  }
}
</style>
