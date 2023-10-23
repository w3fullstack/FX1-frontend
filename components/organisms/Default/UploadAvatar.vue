<template lang="pug">
.xo-default-upload-avatar
  .avatar.row
    .picture(v-if="avatar")
      img(:src="avatar")
    .camera.row.items-center.justify-center(:style="cameraStyles")
      p.camera-name.text-uppercase(v-if="name", :style="cameraNameStyles") {{ name.slice(0, 2) }}
      img(v-else, src="~assets/images/Account/camera.svg")
    .avatar-edit.row.justify-center.items-center(
      v-if="isAllowEditing"
      @contextmenu.prevent="fnShowUploadOptions($event)",
      @click.capture="fnShowUploadOptions($event)"
    )
      b-icon(icon="pencil")
      .avatar-options.flex-column(
        v-if="showUploadOptions",
        :style="{ top: chatPosition.top, left: chatPosition.left }",
        @blur="fnHideUploadOptions",
        ref="avatarOptionsRef"
      )
        .option(@click="fnTriggerChoosePhoto()")
          ._icon: img(src="~assets/images/Account/gallery.svg")
          ._label.text-weight-medium Upload photo
          input(type="file", accept="image/*", @input="fnUploadAvatar", hidden)
        .option._delete(v-if="avatar", @click.prevent="fnDeletePhoto")
          ._icon: img(src="~assets/images/Account/delete.svg")
          ._label.text-weight-medium Delete photo
</template>

<script>
export default {
  name: 'XODefaultUploadAvatar',
  props: {
    avatar: {
      type: String,
      required: true,
      default: '',
    },
    name: {
      type: String,
      required: false,
      default: '',
    },
    isAllowEditing: {
      type: Boolean,
      required: false,
      default: true,
    },
    avatarColors: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
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
    getAvatarBackground() {
      return this.avatarColors?.background || null
    },
    getAvatarColor() {
      return this.avatarColors?.text || null
    },
    cameraStyles() {
      return {
        backgroundColor: this.avatar ? 'rgba(0, 0, 0, 0.5)' : this.getAvatarBackground,
        opacity: this.avatar ? '' : 1,
      }
    },
    cameraNameStyles() {
      return {
        color: this.name && this.getAvatarColor,
      }
    },
  },
  methods: {
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
    fnHideUploadOptions() {
      this.showUploadOptions = false
    },
    fnUploadAvatar(e) {
      this.$emit('uploadAvatar', e)
    },
    fnDeletePhoto() {
      this.fnHideUploadOptions()
      this.$emit('deleteAvatar')
    },
    fnTriggerChoosePhoto() {
      document.querySelector('input[type=file]').click()
    },
  },
}
</script>

<style lang="scss" scoped>
.xo-default-upload-avatar::v-deep {
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
      transition: opacity 250ms ease;
      &-name {
        transform: translateY(6px);
        font-weight: 700;
        font-size: 52px;
        line-height: normal;
      }
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
</style>
