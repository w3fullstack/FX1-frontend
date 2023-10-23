<template lang="pug">
.xd-delete-account.card(v-click-outside="() => $parent.close()")
  .card-content
    .close(@click.prevent="$parent.close()"): img(
      :src="require('~/assets/images/explore-event/close-modal.svg')"
    )
    h3 Delete account
    .warning
      img(
				src="~assets/images/Account/info.svg"
			)
      p
        span This action is irreversible. 
        | Your account will be permanently deleted.
    .divider
    form(action="#", @submit.prevent="")
      .form-item
        label(for="confirmation") To confirm please type “delete my account” below.
        XAFormsInput#IConfirmation(
          v-model="confirmation",
          type="text",
          placeholder="Type here",
          outlined
        )
    .actions
      b-button.is-uppercase(
				@click="$parent.close()"
				type="is-white",
				outlined,
				expanded,
			) Cancel
      b-button.is-uppercase.button-delete-account(
        @click="handleDeleteAccount()",
        type="is-primary",
        expanded,
				:disabled="isButtonSubmitDisabled"
      ) Delete account
</template>
	
<script>
import { mapActions } from 'vuex'

export default {
  name: 'XDDeleteAccount',
	components: {
    XAFormsInput: () => import('~/components/atoms/Forms/Input'),
  },
	data() {
    return {
			isLoading: false,
			confirmation: '',
		}
	},
	computed: {
		isButtonSubmitDisabled() {
			return this.confirmation !== 'delete my account' || this.isLoading
		}
	},
	methods: {
		...mapActions({
      authLoginWithEmail: 'auth/authLoginWithEmail',
      authLoginWithGoogle: 'auth/authLoginWithGoogle',
      authLogOut: 'auth/authLogOut',
    }),
		async handleDeleteAccount() {
			try {
				this.isLoading = true

				await this.$api.deleteUser()
				await this.authLogOut()
				this.$parent.close()
				this.$router.push({
					path: '/',
				})

				this.$toast.success('Account successfully deleted', {
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
				this.isLoading = false
			}
		}
	}
}
</script>
		
<style lang="scss" scoped>
.xd-delete-account {
  background-color: $secondary;
  color: $white;
  padding: 40px 60px;
  .card-content {
    padding: 0;
    .close {
      position: absolute;
      right: 21px;
      top: 21px;
      cursor: pointer;
    }
    h3 {
      margin-bottom: 30px;
      font-weight: 700;
      font-size: 20px;
      line-height: 22px;
      letter-spacing: unset;
      color: $white;
      margin-bottom: 20px;
    }
    p {
      font-size: 16px;
      line-height: 20px;
    }
		.warning {
			display: flex;
			align-items: center;
			gap: 12px;
			margin-top: 24px;
			p {
				span {
					color: $primary;
				}
			}
		}
		.divider {
			width: 100%;
			height: 1px;
			background-color: $tertiary;
			margin: 24px 0;
		}
		form {
			.form-item {
				.xa-forms-input {
					margin-top: 12px;
				}
			}
		}
    .actions {
			display: flex;
			gap: 24px;
      margin-top: 44px;
      button {
        height: 40px;
        font-size: 14px;
        line-height: 18px;
				&.button-delete-account {
					&:disabled {
						background-color: $arsenic;
						border-color: $arsenic;
						color: $spanish-gray;
					}
				} 
      }
    }
  }
}
</style>