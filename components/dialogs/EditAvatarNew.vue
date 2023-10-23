<template lang="pug">
.xd-edit-avatar-new.card
  .card-content
    .close(@click.prevent="$parent.close()"): img(
      :src="require('~/assets/images/explore-event/close-modal.svg')"
    )
    h3 Edit photo
    vue-croppie(
      ref="editAvatar",
      :enableOrientation="true",
      :boundary="boundary",
      :viewport="viewport",
      :enableResize="false",
      v-if="boundary && viewport"
    )
    input(
      type="file",
      accept="image/*",
      @input="($event) => (newFile = $event)",
      hidden,
      ref="inputChoosePhotoRef"
    )
    .actions
      b-button.is-uppercase(
        @click="$refs.inputChoosePhotoRef.click()",
        type="is-white",
        outlined,
        expanded
      ) Choose another
      b-button.is-uppercase(
        type="is-primary",
        :loading="isUploading",
        expanded,
        @click.prevent="fnCropAvatar()"
      ) Apply
</template>

<script>
import { mapActions } from 'vuex'
import { mapFields } from 'vuex-map-fields'

export default {
  name: 'XDEditAvatarNew',
  props: {
    file: { 
			type: null,
			default: null,
		},
		onUploaded: {
			type: Function,
			default: null,
		},
  },
  data() {
    return {
      croppedImage: null,
      isUploading: false,
      boundary: null,
      viewport: null,
      newFile: null,
    }
  },
  computed: {
    ...mapFields('signup', ['avatar', 'avatarCropped']),
  },
  watch: {
    newFile: {
      handler(newFiles) {
        const files = newFiles.target.files || newFiles.dataTransfer.files
				this.fnLoadAvatar(files)
      },
    },
  },
  beforeMount() {
    window.addEventListener('resize', this.fnCheckWindowSize)
  },
  created() {
		const files = this.file.target.files || this.file.dataTransfer.files
    this.fnLoadAvatar(files)
  },
  mounted() {
    this.fnCheckWindowSize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.fnCheckWindowSize)
  },
  methods: {
    ...mapActions({
      mediaUpload: 'media/upload',
    }),
		fnLoadAvatar(files) {
        if (!files.length) return

        const reader = new FileReader()
        reader.onload = (e) => {
          this.$refs.editAvatar.bind({
            url: e.target.result,
          })
        }

        reader.readAsDataURL(files[0])
		},
    async fnCropAvatar() {
      this.isUploading = true

      try {
        const options = {
          format: 'png',
          circle: false,
        }

        await this.$refs.editAvatar.result(options, (output) => {
          this.croppedImage = output
        })

        const { id } = await this.mediaUpload(this.croppedImage)
        this.avatar.objectID = id
        this.avatar.objectType = 'Photo'
        this.avatarCropped = this.croppedImage

				await this.onUploaded({
          id,
        })

        this.$parent.close()
      } catch (error) {
				this.$toast.error(error.message, {
					duration: 5000,
					position: 'bottom-left',
					className: 'fx1-error',
					iconPack: 'mdi',
					icon: 'alert-circle-outline',
				})
      } finally {
        this.isUploading = false
      }
    },
    fnCheckWindowSize() {
      if (window.innerWidth < 768) {
        this.boundary = {
          height: 350,
        }

        this.viewport = {
          width: 250,
          height: 250,
          type: 'circle',
        }
        return
      }

      this.boundary = {
        width: 400,
        height: 400,
      }

      this.viewport = {
        width: 350,
        height: 350,
        type: 'circle',
      }
    },
    fnCancelCrop() {
      this.$root.$emit('evtRtClearAvatarInput')
      this.$parent.close()
    },
  },
}
</script>
	
	<style lang="scss" scoped>
.xd-edit-avatar-new::v-deep {
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
      margin-bottom: 24px;
    }
    .croppie-container {
      .cr-slider-wrap {
        .cr-slider {
          &::-webkit-slider-runnable-track {
            background: $white;
          }
          &::-webkit-slider-thumb {
            width: 24px;
            height: 24px;
            background: $white;
            margin-top: -10px;
          }
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
        white-space: unset;
      }
    }
  }
}
</style>