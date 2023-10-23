<template lang="pug">
.xo-linked-accounts
  p.title.text-weight-regular Connect your social network accounts to login easier.
  .account-connections.flex-column
    .connection.row.col.items-center
      .service.row.items-center
        .provider.row.items-center
          img(src="~assets/images/Account/google.svg")
          p.text-weight-light Google:
          .connected(v-if="getGoogleProvider")
            p {{ getGoogleProvider.email }}
          .connect(
            v-if="!getGoogleProvider",
            @click.prevent="handleConnectGoogle",
            :class="isSubmitting && 'disabled'"
          )
            p.text-weight-light Click to link Google account
      .disconnect
        b-button.is-uppercase(
          v-if="getGoogleProvider && getDefaultProvider",
          @click="handleUnlinkProvider('google.com')",
          type="is-white",
          outlined,
          expanded,
          :disabled="isSubmitting"
        ) Disconnect
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'XOLinkedAccounts',
  data: () => {
    return {
      isSubmitting: false,
    }
  },
  computed: {
    ...mapGetters({
      getProviderData: 'auth/getProviderData',
    }),
    getDefaultProvider() {
      return this.getProviderData?.find((p) => p.providerId === 'password')
    },
    getGoogleProvider() {
      return this.getProviderData?.find((p) => p.providerId === 'google.com')
    },
  },
  methods: {
    ...mapActions({
      refreshToken: 'auth/refreshToken',
      connectGoogleAccount: 'auth/connectGoogleAccount',
      unlinkSocialProvider: 'auth/unlinkSocialProvider',
    }),
    async handleConnectGoogle() {
      this.isSubmitting = true

      try {
        await this.connectGoogleAccount()
        await this.refreshToken()

        this.$toast.success('Google account successfully connected', {
          duration: 5000,
          position: 'bottom-left',
          className: 'fx1-success',
          iconPack: 'mdi',
          icon: 'alert-circle-outline',
        })
      } catch (error) {
        if (error.message === 'FirebaseError: Firebase: This credential is already associated with a different user account. (auth/credential-already-in-use).') {
          error.message = 'This Google account is already in use.'
        }

        this.$toast.error(error.message, {
          duration: 5000,
          position: 'bottom-left',
          className: 'fx1-error',
          iconPack: 'mdi',
          icon: 'alert-circle-outline',
        })
      } finally {
        this.isSubmitting = false
      }
    },
    async handleUnlinkProvider(providerId) {
      this.isSubmitting = true

      try {
        await this.unlinkSocialProvider(providerId)
        await this.refreshToken()

        this.$toast.success('Account successfully disconnected', {
          duration: 5000,
          position: 'bottom-left',
          className: 'fx1-success',
          iconPack: 'mdi',
          icon: 'alert-circle-outline',
        })
      } catch (error) {
        this.$toast.error(error.message, {
          duration: 5000,
          position: 'bottom-left',
          className: 'fx1-error',
          iconPack: 'mdi',
          icon: 'alert-circle-outline',
        })
      } finally {
        this.isSubmitting = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.xo-linked-accounts::v-deep {
  .title {
    color: $white;
    font-size: 16px;
    line-height: 20px;
  }

  .account-connections {
    .connection {
      .service {
        gap: 8px;

        .provider {
          gap: 8px;

          p {
            font-size: 16px;
          }
        }

        .connect {
          &.disabled {
            pointer-events: none;
            opacity: 0.7;
          }

          p {
            color: $grey-mute;
            cursor: pointer;
          }
        }

        .connected {
          p {
            font-size: 18px;
          }
        }
      }

      .disconnect {
        margin-left: auto;
      }
    }
  }
}
</style>
