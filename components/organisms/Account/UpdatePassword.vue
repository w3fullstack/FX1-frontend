<template lang="pug">
.xo-update-password
  .flex-column
    .edit-panel
      .panel-title
        h3 Update password
      .panel-action
        .action-edit(v-if="!isEditing", @click="handleEditing(true)")
          b-icon(icon="pencil")
    form(action="#", @submit.prevent="", :class="isEditing && 'editing'")
      .form-item
        label(for="oldPassword") Old password
        XAFormsInput#IPassword(
          v-model="oldPassword",
          type="password",
          placeholder="Enter old password here",
          @input="handleOldPasswordInput"
          :error="isPasswordIncorrect ? 'Incorrect old password.' : ''"
          :disabled="isSubmitting",
          outlined
        )
      .form-item
        label(for="newPassword") New password
        XAFormsInput#INewPassword(
          v-model="newPassword",
          type="password",
          class="input-new-password"
          placeholder="Enter new password here",
          :message="showNewPasswordMessage ? 'Please ensure your password is at least 8 characters in length, and contains one number, upper and lowercase letters and one special character' : ''",
          @focus="handleNewPasswordFocus"
          @blur="handleNewPasswordBlur"
          :disabled="isSubmitting",
          outlined
        )
  .form-action(v-if="isEditing")
    b-button(
      @click="cancelPasswordChanging",
      type="is-white",
      outlined,
      expanded
    ) Cancel
    b-button.button-update-password(
      @click="handleUpdatePassword"
      type="is-primary",
      expanded
      :disabled="isUpdateButtonDisabled"
    ) Update password
</template>
	
<script>
import { mapActions } from 'vuex'
import { Validator } from 'simple-vue-validator'
import dialogs from '~/mixins/dialogs'

export default {
  name: 'XOAccountUpdatePassword',
  components: {
    XAFormsInput: () => import('~/components/atoms/Forms/Input'),
  },
  mixins: [dialogs],
  validators: {
    newPassword(value) {
      return Validator.value(value)
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/)
    },
  },
  data() {
    return {
      isEditing: false,
      oldPassword: '',
      newPassword: '',
      isNewPasswordFocus: false,
      isPasswordIncorrect: false,
      isSubmitting: false,
    }
  },
  computed: {
    showNewPasswordMessage() {
      return this.newPassword || this.isNewPasswordFocus
    },
    isUpdateButtonDisabled() {
      return this.validation.hasError('newPassword') || !this.oldPassword || this.isSubmitting
    }
  },
  mounted() {
    this.$validate('newPassword')
  },
  methods: {
    ...mapActions({
      updatePassword: 'auth/updatePassword',
    }),
    handleEditing(value) {
      this.isEditing = value
    },
    handleOldPasswordInput() {
      this.isPasswordIncorrect && (this.isPasswordIncorrect = false)
    },
    handleNewPasswordFocus() {
      this.isNewPasswordFocus = true
    },
    handleNewPasswordBlur() {
      this.isNewPasswordFocus = false
    },
    async handleUpdatePassword() {
      this.isSubmitting = true

      try {
        const { oldPassword, newPassword } = this

        await this.updatePassword({
          oldPassword,
          newPassword,
        })

        this.fnShowPasswordUpdatedDialog()
        this.cancelPasswordChanging()
      } catch (error) {
        if (error.message === 'FirebaseError: Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).') {
          this.isPasswordIncorrect = true
        } else {
          this.$toast.error(error.message, {
            duration: 5000,
            position: 'bottom-left',
            className: 'fx1-error',
            iconPack: 'mdi',
            icon: 'alert-circle-outline',
          })
        }
      } finally {
        this.isSubmitting = false
      }
    },
    clearOldPassword() {
      this.oldPassword = ''
    },
    clearNewPassword() {
      this.newPassword = ''
    },
    cancelPasswordChanging() {
      this.handleEditing(false)
      this.clearOldPassword()
      this.clearNewPassword()
    }
  }
}
</script>

<style lang="scss" scoped>
.xo-update-password::v-deep {
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
    margin-top: 32px;
    &:not(.editing) {
      display: none;
    }
    .xa-forms-input {
      &.input-new-password {
        .field {
          .help {
            margin-top: 8px;
            color: $dark-white;
            font-size: 13px;
            line-height: 16px;
          }
        }
      }
      .field {
        .control {
          .icon {
            &.is-right {
              color: $white !important;
            }
          }
        }
      }
    }
  }
  .form-action {
    display: flex;
    gap: 32px;
    margin-top: 40px;
    button {
      max-width: calc(50% - 16px);
      text-transform: uppercase;
      &:last-child {
        margin-left: auto;
      }
      &.button-update-password {
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