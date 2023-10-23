<template lang="pug">
.xo-video-mic-camera-controls
  .media-container(:class="{ on: audio }")
    button.btn(type="button", @click="toggleAudio()")
      nuxt-img(
        :src="audio ? '/explore-event/microphone.svg' : '/explore-event/microphone-off.svg'",
        width="24",
        height="24"
      )

    button.btn.arrow(type="button", @click="toggleMenu('audio')")
      nuxt-img(
        v-if="!audioPermissionsGranted",
        src="/explore-event/info-circle.svg",
        width="16",
        height="16"
      )
      nuxt-img(
        v-else,
        src="/explore-event/chevron.svg",
        :class="{ opened: isShowAudioDevices }",
        width="16",
        height="16"
      )

    .media-devices.audio(
      v-if="isShowAudioDevices",
      v-click-outside="{ events: ['click'], handler() { isShowAudioDevices = false } }"
    )
      template(v-if="audioDevices.length > 0")
        .title-container
          nuxt-img(
            src="/explore-event/microphone_dark.svg",
            width="24",
            height="24"
          )

          p.title-container__title Select microphone

        .devices
          .device-name_container(
            v-for="(device, index) in audioDevices",
            :key="device.deviceId"
          )
            p(@click="audioDeviceId = device.deviceId")
              | {{ device.label || `audio device #${index + 1}` }}
            nuxt-img(
              v-if="device.deviceId === audioDeviceId",
              src="/explore-event/check-circle.svg",
              width="24",
              height="24"
            )

      .divider(
        v-if="audioDevices.length > 0 && audioOutputDevices.length > 0"
      )

      template(v-if="audioOutputDevices.length > 0")
        .title-container
          nuxt-img(
            src="/explore-event/speaker.svg",
            width="24",
            height="24"
          )

          p.title-container__title Select speaker

        .devices
          .device-name_container(
            v-for="(device, index) in audioOutputDevices",
            :key="device.deviceId"
          )
            p(@click="audioOutputDeviceId = device.deviceId")
              | {{ device.label || `audio output device #${index + 1}` }}
            nuxt-img(
              v-if="device.deviceId === audioOutputDeviceId",
              src="/explore-event/check-circle.svg",
              width="24",
              height="24"
            )

  .media-container(:class="{ on: video }")
    button.btn(type="button", @click="toggleVideo()")
      nuxt-img(
        :src="video ? '/explore-event/camera.svg' : '/explore-event/camera-off.svg'",
        width="24",
        height="24"
      )

    button.btn.arrow(type="button", @click="toggleMenu('video')")
      nuxt-img(
        v-if="!videoPermissionsGranted",
        src="/explore-event/info-circle.svg",
        width="16",
        height="16"
      )
      nuxt-img(
        v-else,
        src="/explore-event/chevron.svg",
        :class="{ opened: isShowVideoDevices }",
        width="16",
        height="16"
      )

    .media-devices(
      v-if="isShowVideoDevices",
      v-click-outside="{ events: ['click'], handler() { isShowVideoDevices = false } }"
    )
      template(v-if="videoDevices.length > 0")
        .title-container
          nuxt-img(
            src="/explore-event/camera_dark.svg",
            width="24",
            height="24"
          )

          p.title-container__title Select camera

        .devices
          .device-name_container(
            v-for="(device, index) in videoDevices",
            :key="device.deviceId"
          )
            p(@click="videoDeviceId = device.deviceId")
              | {{ device.label || `video device #${index + 1}` }}
            nuxt-img(
              v-if="device.deviceId === videoDeviceId",
              src="/explore-event/check-circle.svg",
              width="24",
              height="24"
            )
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import {
  switchAudioDevice,
  switchVideoDevice,
  muteLocalAudio,
  muteLocalVideo,
  unmuteLocalVideo,
  unmuteLocalAudio,
  getMediaDevices,
} from '~/scripts/twilio/utils'

export default {
  name: 'XOVideoMicCameraControls',
  data() {
    return {
      isShowAudioDevices: false,
      isShowVideoDevices: false,
      audio: false,
      video: false,
    }
  },
  computed: {
    ...mapFields('chats', [
      'room',
      'audioDeviceId',
      'audioPermissionsGranted',
      'audioDevices',
      'videoDeviceId',
      'videoPermissionsGranted',
      'videoDevices',
      'audioOutputDeviceId',
      'audioOutputDevices',
    ]),
  },
  watch: {
    async audioDeviceId(val) {
      if (!this.audio) return

      try {
        await switchAudioDevice(this.room, val)
      } catch (error) {
        this.$sentry.captureException(error)
      }
    },
    async videoDeviceId(val) {
      if (!this.video) return

      try {
        await switchVideoDevice(this.room, val)
      } catch (error) {
        this.$sentry.captureException(error)
      }
    },
    async audio(val) {
      if (val) {
        this.audioDeviceId = await switchAudioDevice(this.room, this.audioDeviceId)
        unmuteLocalAudio(this.room)
      } else {
        muteLocalAudio(this.room)
      }
    },
    async video(val) {
      if (val) {
        this.videoDeviceId = await switchVideoDevice(this.room, this.videoDeviceId)
        unmuteLocalVideo(this.room)
      } else {
        muteLocalVideo(this.room)
      }
    },
  },
  mounted() {
    this.$root.$on('audioOff', () => {
      this.toggleAudio(false)
    })

    this.$root.$on('videoOff', () => {
      this.toggleVideo(false)
    })
  },
  methods: {
    async connectDevice(device) {
      try {
        const switchDevice =
          device === 'audio' ? switchAudioDevice : switchVideoDevice

        await switchDevice(this.room)

        await this.setDevicesList()

        const permissions = device === 'audio' ? 'audioPermissionsGranted' : 'videoPermissionsGranted'

        this[permissions] = true
        this[device] = true
      } catch (error) {
        this.$sentry.captureException(error)
      }
    },
    async toggleMenu(type) {
      switch (type) {
        case 'audio':
          if (this.audioPermissionsGranted) {
            this.isShowAudioDevices = !this.isShowAudioDevices
          } else {
            await this.connectDevice('audio')
          }
          break
        case 'video':
          if (this.videoPermissionsGranted) {
            this.isShowVideoDevices = !this.isShowVideoDevices
          } else {
            await this.connectDevice('video')
          }
      }
    },
    async setDevicesList() {
      const groupedDevices = await getMediaDevices()

      if (groupedDevices.audioinput) {
        this.audioDevices = groupedDevices.audioinput
      }

      if (groupedDevices.videoinput) {
        this.videoDevices = groupedDevices.videoinput
      }

      if (groupedDevices.audiooutput) {
        this.audioOutputDevices = groupedDevices.audiooutput
      }
    },
    toggleAudio(newValue) {
      if (!this.room || !this.audioPermissionsGranted) return

      this.audio = newValue ?? !this.audio
    },
    toggleVideo(newValue) {
      if (!this.room || !this.videoPermissionsGranted) return

      this.video = newValue ?? !this.video
    },
  },
}
</script>

<style lang="scss" scoped>
.xo-video-mic-camera-controls {
  display: flex;
  gap: 16px;
  margin-left: 25px;

  .media-container {
    display: flex;
    margin: 2px;
    background-color: $tertiary;
    border-radius: 8px;
    position: relative;

    &.on {
      background-color: #00a558;
    }

    .btn {
      cursor: pointer;
      padding: 8px;
      display: grid;
      place-content: center;
      background-color: transparent;
      border: none;

      &:first-child {
        border-radius: 7px 0 0 7px;
        padding-right: 4px;
      }

      &.arrow {
        border-radius: 0 7px 7px 0;
        padding-left: 4px;

        .opened {
          transform: rotate(180deg);
        }
      }
    }

    .media-devices {
      width: 295px;
      position: absolute;
      top: 45px;
      right: 0;
      padding: 20px;
      box-shadow: 0px 4px 10px 0px rgba(10, 39, 46, 0.15);
      border-radius: 5px;
      background-color: #ffffff;

      &.audio {
        @include max-width(767px) {
          right: -80px;
        }
      }
    }

    .title-container {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      &__title {
        margin-left: 20px;
        font-family: 'Rotunda';
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        letter-spacing: -0.66px;
        color: #08252c;
      }
    }

    .divider {
      border-top: 1px solid #c3cdcf;
      margin-block: 16px;
    }

    .devices {
      > :not(:last-child) {
        margin-bottom: 16px;
      }

      .device-name_container {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;

        p {
          width: 85%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
          line-height: 24px;
          letter-spacing: -0.66px;
          color: #0c353e;
        }
      }
    }
  }
}
</style>
