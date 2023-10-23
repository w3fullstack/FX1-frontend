<template lang="pug">
.xo-upload-photo
  .row
    .col
      XODefaultUploadAvatar(
        :avatar="getUserAvatar",
        v-on:uploadAvatar="fnUploadAvatar",
        v-on:deleteAvatar="fnDeleteAvatar"
      )
</template>

<script>
import { mapMutations } from 'vuex'
import { mapFields } from 'vuex-map-fields'
import dialogs from '~/mixins/dialogs'
import XODefaultUploadAvatar from '~/components/organisms/Default/UploadAvatar.vue'

export default {
  name: 'XOAccountUploadPhoto',
  components: {
    XODefaultUploadAvatar,
  },
  mixins: [dialogs],
  data() {
    return {
      showUploadOptions: false,
      chatPosition: {
        top: 0,
        left: 0,
      },
    }
  },
  computed: {
    ...mapFields('user', ['userAvatar']),
    getUserAvatar() {
      return this.userAvatar ?? ''
    },
  },
  methods: {
    ...mapMutations('user', ['resetUserState']),
    fnShowUploadOptions(e) {
      if (!e || this.showUploadOptions) return

      const element = e.currentTarget.getBoundingClientRect()

      this.chatPosition.top = `${element.height + 4}px`

      this.$nextTick(() => {
        this.showUploadOptions = true

        this.$nextTick(() => {
          const options = this.$refs.avatarOptionsRef
          options.setAttribute('tabindex', 0)
          options.focus()
        })
      })
    },
    fnUploadAvatar(e) {
      this.fnShowEditAvatarNewDialog(e, async ({ id }) => {
        try {
          await this.$api.updateUserAvatar({
            objectID: id,
          })

          const { Me: { Avatar } } = await this.$api.getMyProfile()

          this.$store.dispatch('user/setUserAvatar', Avatar.PhotoURL)
        } catch (error) {
          this.$toast.error(error.message, {
            duration: 5000,
            position: 'bottom-left',
            className: 'fx1-error',
            iconPack: 'mdi',
            icon: 'alert-circle-outline',
          })
        }
      })
    },
    async fnDeleteAvatar() {
      this.showUploadOptions = false

      await this.$api.updateUserAvatar({
        objectID: null,
      })

      this.resetUserState()
    },
  },
}
</script>

<style lang="scss" scoped>
.xo-upload-photo::v-deep {
  margin-bottom: 40px;
  .row {
    .col {
      .account-avatar {
        .avatar {
          position: relative;
          width: 160px;
          height: 160px;
          background-color: $secondary;
          border-radius: 50%;
          @include max-width(768px) {
            width: 120px;
            height: 120px;
          }
          &:hover {
            .camera {
              opacity: 1;
            }
          }
          .camera,
          .picture {
            width: 100%;
            height: 100%;
            border-radius: inherit;
            overflow: hidden;
          }
          .picture {
            img {
              width: 100%;
              height: 100%;
            }
          }
          .camera {
            opacity: 0;
            position: absolute;
            background-color: rgba(000, 000, 000, 0.5);
            transition: opacity 250ms ease;
          }
          &-edit {
            position: absolute;
            width: 48px;
            height: 48px;
            bottom: 0;
            right: 0;
            background-color: $tertiary;
            border-radius: 50%;
            cursor: pointer;
          }
          &-options {
            gap: 20px;
            position: absolute;
            min-width: 188px;
            top: 0;
            left: 0;
            background-color: $secondary;
            border-radius: 8px;
            z-index: 2;
            .option {
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              position: relative;
              padding: 0 16px;
              font-weight: 300;
              font-size: 1.1429rem;
              cursor: pointer;
              &:first-child {
                padding-top: 16px;
              }
              &:last-child {
                padding-bottom: 16px;
              }
              &._delete {
                color: $primary;
              }
              input[type='file'] {
              }
              ._icon {
                display: flex;
                flex-wrap: wrap;
                width: 35px;
              }
              ._label {
                font-family: $tertiary-font;
              }
            }
          }
        }
      }
    }
  }
}
</style>
