<template lang="pug">
.xo-general-settings
  .flex-column
    .edit-panel
      .panel-title
        h3 General Settings
      .panel-action
        .action-edit(v-if="!isEditing", @click="handleEditing(true)")
          b-icon(icon="pencil")
    form(action="#", @submit.prevent="", :class="isEditing && 'editing'")
      .form-item
        label(for="username") Username
        XAFormsInput#IUsername(
          v-model="username",
          placeholder="Username",
          :disabled="isSubmitting",
          outlined,
          @input="fnUsernameValidation()",
          :loading="isChecking",
          :error="validation.firstError('username') || usernameUniqueError",
          icon-on-right="close",
          @icon-on-right-click="clearUsername"
        )
      .form-item(v-if="!isSocialAccount")
        label(for="email") Email
        XAFormsInput#IEmail(
          v-model="email",
          placeholder="Email",
          :disabled="isSubmitting",
          outlined,
          @input="fnEmailValidation()",
          :error="validation.firstError('email')",
          icon-on-right="close",
          @icon-on-right-click="clearEmail"
        )
    .alert(v-if="!isEmailVerified")
      img(src="~assets/images/Account/info.svg")
      p Please follow the instructions in the email we sent to complete the change of email.
  .form-action(v-if="isEditing")
    b-button(@click="cancelEditing", type="is-white", outlined, expanded) Cancel
    b-button.button-save(
      @click="saveChanges",
      type="is-primary",
      outlined,
      expanded,
      :disabled="isSaveButtonDisabled"
    ) Save
</template>

<script>
import { Validator } from 'simple-vue-validator'
import debounce from 'lodash/debounce'
import { mapFields } from 'vuex-map-fields'
import dialogs from '~/mixins/dialogs'

export default {
  name: 'XOAccountGeneralSettings',
  components: {
    XAFormsInput: () => import('~/components/atoms/Forms/Input'),
  },
  mixins: [dialogs],
  validators: {
    username(value) {
      return Validator.value(value)
        .required('Sorry, a username is required')
        .custom(() => {
          if (!/^\w+$/.test(value)) {
            return 'Please use only letters, numbers and underscores for your username'
          }
        })
        .minLength(
          3,
          'Please ensure your username is between 3 to 18 characters in length'
        )
        .maxLength(
          18,
          'Please ensure your username is between 3 to 18 characters in length'
        )
    },
    email(value) {
      return Validator.value(value).required('Email field is required.').email()
    },
  },
  data() {
    return {
      isEditing: false,
      username: '',
      email: '',
      isSubmitting: false,
      isChecking: false,
      usernameUniqueError: null,
    }
  },
  computed: {
    ...mapFields('user', ['userName', 'userEmail', 'unverifiedEmailAddress', 'isEmailVerified', 'isSocialAccount']),
    isAnyChanges() {
      return (
        this.username !== this.userName ||
        this.email !== this.userEmail
      )
    },
    isSaveButtonDisabled() {
      if (
        this.validation.hasError('username') ||
        this.validation.hasError('email') ||
        this.isChecking ||
        this.usernameUniqueError ||
        this.isSubmitting
      ) {
        return true
      } else if (this.isAnyChanges) {
        return false
      } else {
        return true
      }
    },
  },
  watch: {
    userName: {
      immediate: true,
      handler(value) {
        this.username = value
      },
    },
    userEmail: {
      immediate: true,
      handler(value) {
        if (this.unverifiedEmailAddress) {
          this.email = this.unverifiedEmailAddress
        } else {
          this.email = value
        }
      },
    },
  },
  mounted() {
    this.username = this.userName
    this.email = this.userEmail
  },
  methods: {
    fnUsernameValidation: debounce(async function () {
      if (!this.username || this.userName === this.username) return
      this.isChecking = true

      try {
        const { userNameExists } = await this.$api.userNameExists({
          username: this.username,
        })

        if (userNameExists) {
          this.usernameUniqueError = 'Username already exists.'
        } else {
          this.usernameUniqueError = null
        }
      } catch (error) {
        this.$toast.error(error.message, {
          duration: 5000,
          position: 'bottom-left',
          className: 'fx1-error',
          iconPack: 'mdi',
          icon: 'alert-circle-outline',
        })
      } finally {
        this.isChecking = false
      }
    }, 300),
    fnEmailValidation: debounce(async function () {
      // To do email already existing validation
    }, 300),
    async updateUsername() {
      this.isSubmitting = true
      try {
        await this.$api.updateUserUsername({
          username: this.username,
        })
        this.$store.dispatch('user/setUserName', this.username)

        this.$toast.success('Username updated successfully', {
          duration: 5000,
          position: 'bottom-left',
          className: 'fx1-success',
          iconPack: 'mdi',
          icon: 'check-circle-outline',
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
    async updateEmail() {
      this.isSubmitting = true

      try {
        await this.$api.changeEmail({
          input: {
            email: this.email,
          },
        })

        this.handleEditing(false)
        this.fnEmailConfirmationDialog(this.email, async () => {
          const { Me:{ isEmailVerified } } = await this.$api.getMyProfile()

          this.$store.dispatch('user/setIsEmailVerified', isEmailVerified)
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
    saveChanges() {
      this.username !== this.userName && this.updateUsername()
      this.email !== this.userEmail && this.updateEmail()
      this.isEditing = !this.isEditing
    },
    handleEditing(value) {
      this.isEditing = value
    },
    cancelEditing() {
      this.handleEditing(false)
      this.username = this.userName
      this.email = this.userEmail
    },
    clearUsername() {
      this.username = ''
    },
    clearEmail() {
      this.email = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.xo-general-settings::v-deep {
  max-width: 500px;
  label {
    display: inline-block;
    margin-bottom: 8px;
    color: $dark-white;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .edit-panel {
    display: flex;
    margin-bottom: 32px;
    .panel-action {
      display: flex;
      align-items: center;
      margin-left: 32px;
      cursor: pointer;
      p {
        font-weight: 500;
        font-size: 14px;
        letter-spacing: 0.8px;
        text-transform: uppercase;
      }
      .action-edit {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 40px;
    &:not(.editing) {
      gap: 32px;
      .xa-forms-input {
        pointer-events: none;
        &.has-error {
          .input-error {
            display: none;
          }
          .field {
            .control {
              input[type='text'] {
                border-color: transparent !important;
              }
            }
          }
        }
        .field {
          .control {
            input[type='text'],
            input[type='password'] {
              height: 20px;
              padding: 0;
              border-color: transparent;
            }
            .icon {
              &.is-right {
                display: none;
              }
            }
          }
        }
      }
    }
  }
  .alert {
    display: flex;
    gap: 19px;
    background-color: $secondary;
    margin-top: 20px;
    padding: 8px 12px;
    img {
      width: 24px;
      height: 24px;
    }
    p {
      color: $primary;
    }
  }
  .form-action {
    display: flex;
    gap: 32px;
    margin-top: 40px;
    button {
      text-transform: uppercase;
      &.button-save {
        &:disabled {
          background-color: $arsenic;
          border-color: $arsenic;
          color: $spanish-gray;
        }
      }
    }
  }
}
</style>
