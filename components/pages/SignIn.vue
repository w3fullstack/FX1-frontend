<template lang="pug">
.xp-sign-in.auth-page
  .step-content.row
    .left-content.row.items-center.justify-center
      .form-container
        .form-header
          h1 Sign In
          h4.text-weight-light New user? #[nuxt-link(to="/signup?step=1") Create an account]

        form(action="#", autocomplete="off")
          .mb-5: XAFormsInput#IEmail(
            v-model="email",
            placeholder="Email",
            :disabled="isSubmitting",
            @enter="fnLoginViaEmail()",
            :error="validation.firstError('email')"
          )
          .mb-3: XAFormsInput#IPassword(
            v-model="password",
            type="password",
            placeholder="Password",
            :disabled="isSubmitting",
            @enter="fnLoginViaEmail()",
            :error="validation.firstError('password')"
          )
          .forgot-password.mb-6: nuxt-link(to="/forgot-password") Forgot Password?

          .actions
            .mb-4: b-button#BSubmit.btn-next(
              type="is-primary",
              @click.prevent="fnLoginViaEmail()",
              :loading="isSubmitting"
            ) Sign In

            .row
              .btn-google.row.items-center.justify-center(
                :class="[isSubmitting && 'disabled']",
                @click.prevent="fnLoginViaGoogle()"
              )
                ._icon.row: img(src="~assets/images/Auth/google.svg")
                .value Sign In with Google

    XMSignUpRightContent
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapActions } from 'vuex'
import { Validator } from 'simple-vue-validator'

export default {
  name: 'XPSignIn',
  validators: {
    email(value) {
      return Validator.value(value)
        .required('Sorry, we need a email to send you important updates')
        .email(`Hmmm, that email doesn't look right, maybe try again?`)
    },
    password(value) {
      return Validator.value(value).required(
        'Sorry, please enter a secure password'
      )
    },
  },
  components: {
    XAFormsInput: () => import('~/components/atoms/Forms/Input'),
    XMSignUpRightContent: () =>
      import('~/components/molecules/SignUp/RightContent'),
  },
  data() {
    return {
      isSubmitting: false,
      isNewUser: false,
      loginMethod: null,
      substringUrl: null,
      acceptInProcess: false,
    }
  },
  computed: {
    ...mapFields('signup', [
      'username',
      'email',
      'password',
      'firstName',
      'lastName',
      'avatarSocial',
      'signupOwnerManagerInvite',
      'signupLockerRoomSupporting',
      'signupMethod',
    ]),
    ...mapFields('user', ['userID']),
  },
  methods: {
    ...mapActions({
      authLoginWithEmail: 'auth/authLoginWithEmail',
      authLoginWithGoogle: 'auth/authLoginWithGoogle',
    }),
    async fnLoginViaEmail() {
      try {
        this.isSubmitting = true
        this.loginMethod = 'Email'

        const success = await this.$validate()

        if (success) {
          const { email, password } = this
          await this.authLoginWithEmail({ email, password })
          await this.fnAfterLogin()
        }
      } catch (error) {
        this.showError(error)
      } finally {
        this.isSubmitting = false
      }
    },
    async fnLoginViaGoogle() {
      this.validation.reset()
      this.email = null
      this.password = null
      this.isSubmitting = true
      this.signupMethod = 'google'

      try {
        const result = await this.authLoginWithGoogle()
        if (!result) return
        if (result?.additionalUserInfo?.isNewUser) {
          const {
            additionalUserInfo: {
              profile: {
                family_name: familyName,
                given_name: givenName,
                picture,
                email,
              },
            },
          } = result

          this.email = email
          this.firstName = familyName
          this.lastName = givenName
          this.avatarSocial = picture
        }

        await this.fnCreateUser(result)

        this.loginMethod = 'Google'
        await this.fnAfterLogin()
      } catch (error) {
        error?.response?.errors.forEach((error) => {
          this.$toast.success(error.message, {
            duration: 5000,
            position: 'bottom-left',
            className: 'fx1-success',
            iconPack: 'mdi',
            icon: 'alert-circle-outline',
          })
        })
      } finally {
        this.isSubmitting = false
      }
    },
    async fnCreateUser(result) {
      const {
        additionalUserInfo: {
          profile: { family_name: familyName, given_name: givenName },
        },
        result: {
          user: { accessToken },
        },
      } = result

      const input = {
        username: null,
        firstName: givenName,
        lastName: familyName,
        Avatar: null,
      }

      try {
        await this.$api.createUser(
          { input },
          {
            Authorization: `Bearer ${accessToken}`,
          }
        )
      } catch (error) {
        error?.response?.errors.forEach((error) => {
          this.$toast.success(error.message, {
            duration: 5000,
            position: 'bottom-left',
            className: 'fx1-success',
            iconPack: 'mdi',
            icon: 'alert-circle-outline',
          })
        })
      }
    },
    async fnAfterLogin() {
      const { accept } = this.$route.query
      const params = {
        loginMethod: this.loginMethod,
        pageName: 'Sign-in',
      }

      this.$mixpanelClient.trackLogin(params)

      if (!accept) {
        await this.fnAcceptInvite()
      } else {
        await this.fnAcceptPrivateInvitation()
      }

      await this.fnRetrieveUserDetails()
    },
    async fnAcceptInvite() {
      if (!this.signupOwnerManagerInvite) return

      try {
        const { respondUserManagerialRoleInvite } =
          await this.$api.respondUserManagerialRoleInvite({
            id: this.signupOwnerManagerInvite?.id,
          })
        await this.$router.push({
          path: respondUserManagerialRoleInvite?.objectID,
        })
      } catch (error) {
        error?.response?.errors.forEach((error) => {
          this.$toast.success(error.message, {
            duration: 5000,
            position: 'bottom-left',
            className: 'fx1-success',
            iconPack: 'mdi',
            icon: 'alert-circle-outline',
          })
        })
      } finally {
        this.signupOwnerManagerInvite = null
      }
    },
    async fnRetrieveUserDetails() {
      if (this.acceptInProcess) return

      try {
        const { next } = this.$route.query
        const { Me: { id, uid } } = await this.$api.getMyProfile()

        this.userID = id
        this.$mixpanel.identify(uid)

        if (this.signupLockerRoomSupporting) {
          const { urlSupport } = await this.fnSupportClub()
          await this.$router.push({
            path: urlSupport,
          })
          return
        }

        if (next) {
          const redirectUrl =
            typeof next === 'object' && next.length > 0 ? next[0] : next

          await this.$router.push({
            path: redirectUrl,
          })
        } else if (this.substringUrl) {
          await this.$router.push(this.substringUrl)
        } else if (!this.substring && !this.acceptInProcess) {
          await this.$router.push({
            path: '/explore',
          })
        }
      } catch (error) {
        error?.response?.errors.forEach((error) => {
          this.$toast.success(error.message, {
            duration: 5000,
            position: 'bottom-left',
            className: 'fx1-success',
            iconPack: 'mdi',
            icon: 'alert-circle-outline',
          })
        })
      }
    },
    async fnSupportClub() {
      const {
        signupLockerRoomSupporting: { id, slug, defaultChannelSlug },
      } = this

      try {
        await this.$api.supportClub({
          lockerRoomID: id,
        })
        this.signupLockerRoomSupporting = null
        return {
          urlSupport: `/locker-room/${slug}/${defaultChannelSlug}` || null,
        }
      } catch (error) {
        error?.response?.errors.forEach((error) => {
          this.$toast.success(error.message, {
            duration: 5000,
            position: 'bottom-left',
            className: 'fx1-success',
            iconPack: 'mdi',
            icon: 'alert-circle-outline',
          })
        })
      }
    },
    async fnAcceptPrivateInvitation() {
      this.acceptInProcess = true
      try {
        const { acceptInvitationToPrivateChannel } =
          await this.$api.acceptInvitationToPrivateChannel({
            token: this.$route.query.accept,
          })

        const redirectUrl = acceptInvitationToPrivateChannel.objectID
        const startIndex = redirectUrl.indexOf('io') + 2
        this.substringUrl = redirectUrl.substring(startIndex)

        this.acceptInProcess = false
      } catch (e) {
        this.showError(e)
      } finally {
        this.isSubmitting = false
        this.acceptInProcess = false
      }
    },
    showError(e) {
      const message = e.toString()
      const findError = (error) => {
        if (message.includes(error)) {
          return message
        }
      }

      switch (message) {
        case findError('user-not-found'):
          this.$toast.error('There is no user record found.', {
            duration: 5000,
            position: 'top-center',
          })
          break

        case findError('wrong-password'):
          this.$toast.error(
            'The password is invalid or the user does not have a password.',
            {
              duration: 5000,
              position: 'top-center',
            }
          )
          break

        case findError('cannot create or join more'):
          this.$toast.error(
            'You cannot create or join more than one private group per game.',
            {
              duration: 5000,
              position: 'top-center',
            }
          )
          break

        case findError('you must be logged in'):
          this.$toast.error(
            'Sorry, you must be logged in to take this action.',
            {
              duration: 5000,
              position: 'top-center',
            }
          )
          break

        case findError('Invite does not exist'):
          this.$toast.error('User Invite does not exist.', {
            duration: 5000,
            position: 'top-center',
          })
          break

        case findError('invitation is not valid'):
          this.$toast.error('The invitation is not valid.', {
            duration: 5000,
            position: 'top-center',
          })
          break

        case findError('Channel does not exist'):
          this.$toast.error('The Private Channel does not exist.', {
            duration: 5000,
            position: 'top-center',
          })
          break

        default:
          break
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.xp-sign-in::v-deep {
  .step-content {
    .left-content {
      @include max-width(1023px) {
        min-height: calc(100vh - 60px) !important;
        align-items: flex-start;
      }

      .form-container {
        form {
          .forgot-password {
            a {
              font-weight: 400;
              color: $secondary;
            }
          }
        }
      }
    }
  }
}
</style>
