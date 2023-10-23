<template lang="pug">
.xp-account-settings
  AccountUploadPhoto
  .flex-column
    .col
      AccountGeneralSettings
    template(v-if="isShowUpdatePassword")
      .divider
      .col
        AccountUpdatePassword
    .divider
    .col
      AccountDelete
</template>

<script>
import { mapGetters } from 'vuex'
import AccountUploadPhoto from '~/components/organisms/Account/UploadPhoto.vue'
import AccountGeneralSettings from '~/components/organisms/Account/GeneralSettings.vue'
import AccountUpdatePassword from '~/components/organisms/Account/UpdatePassword.vue'
import AccountDelete from '~/components/organisms/Account/AccountDelete.vue'

export default {
  name: 'PageAccountSettings',
  components: {
    AccountUploadPhoto,
    AccountGeneralSettings,
    AccountUpdatePassword,
    AccountDelete
  },
  computed: {
    ...mapGetters({
			getProviderData: 'auth/getProviderData',
		}),
    isShowUpdatePassword() {
      return this.getProviderData?.find((p) => p.providerId === 'password')
    },
  },
}
</script>

<style lang="scss" scoped>
.xp-account-settings {
  .divider {
    width: 100%;
    height: 1px;
    background-color: $tertiary;
    margin: 40px 0;
  }
}
</style>