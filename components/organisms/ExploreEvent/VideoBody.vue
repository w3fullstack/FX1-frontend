<template lang="pug">
.xo-video-body(:class="{ more: isMore }")
  XALoader(v-if="!visibleMembers.length", :size="24")
  .member(
    v-else,
    v-for="{ member, participant } in visibleMembers",
    :key="participant.sid"
  )
    XAAvatar.avatar(
      :name="member.username",
      :image="member.avatar",
      :size="isMore ? '62px' : '128px'"
    )
    XOVideo(:participant="participant")
    .name
      .muted(v-if="isMuted(participant.sid)")
      span {{ member.username }}
  .member.placeholder(v-if="hiddenCount > 0") +{{ hiddenCount }}

  .audio
    XOAudio(
      v-for="participant in allParticipants",
      :participant="participant",
      :key="participant.sid",
      @audioMute="audioMute(participant.sid)",
      @audioUnmute="audioUnmute(participant.sid)"
    )
</template>

<script>
import { mapFields } from 'vuex-map-fields'

import XOAudio from './Audio.vue'
import XOVideo from './Video.vue'
import XAAvatar from '~/components/atoms/Avatar.vue'

import { connectToRoomWithoutDevices } from '~/scripts/twilio'
import { getMediaDevices } from '~/scripts/twilio/utils'

const MORE_LIMIT = 3
const MAX_LIMIT = 10

export default {
  name: 'XOVideoBody',
  components: {
    XOAudio,
    XOVideo,
    XAAvatar,
    XALoader: () => import('~/components/atoms/Loader'),
  },
  props: {
    privateChannel: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      allParticipants: [],
      unmuted: [],
      audioPermissionStatus: null,
      videoPermissionStatus: null,
    }
  },
  computed: {
    members() {
      return new Map(
        [
          ...this.privateChannel.Roles.Owners,
          ...this.privateChannel.Roles.Joiners,
          ...this.newMembers,
        ].map(({ User }) => [
          User.id,
          {
            username: User.username,
            avatar: User.Avatar?.PhotoURL || '',
          },
        ])
      )
    },
    visibleMembers() {
      return this.enrichedAllParticipants.slice(
        0,
        this.enrichedAllParticipants.length > MAX_LIMIT
          ? MAX_LIMIT - 1
          : MAX_LIMIT
      )
    },
    isMore() {
      return this.enrichedAllParticipants.length > MORE_LIMIT
    },
    hiddenCount() {
      return this.enrichedAllParticipants.length - this.visibleMembers.length
    },
    enrichedAllParticipants() {
      const participants = []

      this.allParticipants.forEach((participant) => {
        const member = this.members.get(participant.identity) ?? {}

        participants.push({
          participant,
          member,
        })
      })

      return participants
    },
    ...mapFields('chats', [
      'room',
      'newMembers',
      'audioDeviceId',
      'audioDevices',
      'audioPermissionsGranted',
      'videoDeviceId',
      'videoDevices',
      'videoPermissionsGranted',
      'audioOutputDevices',
    ]),
  },
  async mounted() {
    await this.mountVideoChat()
  },
  beforeDestroy() {
    this.room?.localParticipant.tracks.forEach((publication) => {
      publication.track.stop()
      this.room.localParticipant.unpublishTrack(publication.track)
    })
    this.room?.disconnect()
    this.room = null

    this.audioPermissionStatus?.removeEventListener('change', this.onAudioPermissionStatusChange)
    this.videoPermissionStatus?.removeEventListener('change', this.onVideoPermissionStatusChange)
  },
  methods: {
    async mountVideoChat() {
      const {
        getAccessToken: { objectID },
      } = await this.$api.getAccessToken({
        privateGroup: this.privateChannel.id,
      })

      try {
        this.room = await connectToRoomWithoutDevices({
          token: objectID,
          roomName: this.privateChannel.id,
        })
      } catch (e) {
        this.$sentry.captureException(e)
      }

      try {
        this.audioPermissionStatus = await navigator.permissions.query({
          name: 'microphone',
        })

        this.onAudioPermissionStatusChange()
        this.audioPermissionStatus.addEventListener('change', this.onAudioPermissionStatusChange)
      } catch (error) {
        // NOTE: microphone/camera permission check currently not supported in Firefox
        if (error instanceof TypeError) {
          this.audioPermissionsGranted = true
        }
        this.$sentry.captureException(error)
      }

      try {
        this.videoPermissionStatus = await navigator.permissions.query({
          name: 'camera',
        })

        this.onVideoPermissionStatusChange()
        this.videoPermissionStatus.addEventListener('change', this.onVideoPermissionStatusChange)
      } catch (error) {
        // NOTE: microphone/camera permission check currently not supported in Firefox
        if (error instanceof TypeError) {
          this.videoPermissionsGranted = true
        }
        this.$sentry.captureException(error)
      }

      if (this.audioPermissionsGranted || this.videoPermissionsGranted) {
        await this.setDevicesList()
      }

      const { localParticipant, participants } = this.room

      this.allParticipants.push(localParticipant, ...participants.values())

      // handle new connections
      this.room.on('participantConnected', async (participant) => {
        this.allParticipants.push(participant)
        if (!this.members.has(participant.identity)) {
          const member = await this.fetchMember(participant.identity)
          if (member) {
            this.newMembers.push(member)
          }
        }
      })

      // handle disconnects
      this.room.on('participantDisconnected', (participant) => {
        const participantIndex = this.allParticipants.findIndex(
          (p) => p.sid === participant.sid
        )
        if (participantIndex > -1) {
          this.allParticipants.splice(participantIndex, 1)
        }
        this.audioMute(participant.sid)
      })
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
    audioMute(uId) {
      const unmutedIndex = this.unmuted.findIndex(
        (id) => id === uId
      )
      if (unmutedIndex > -1) {
        this.unmuted.splice(unmutedIndex, 1)
      }
    },
    audioUnmute(uId) {
      if (this.isMuted(uId)) {
        this.unmuted.push(uId)
      }
    },
    isMuted(uId) {
      return !this.unmuted.includes(uId)
    },
    onAudioPermissionStatusChange() {
      if (this.audioPermissionsGranted && this.audioPermissionStatus.state === 'denied') {
        this.$root.$emit('audioOff')
      }
      this.audioPermissionsGranted = this.audioPermissionStatus.state === 'granted'
    },
    onVideoPermissionStatusChange() {
      if (this.videoPermissionsGranted && this.videoPermissionStatus.state === 'denied') {
        this.$root.$emit('videoOff')
      }
      this.videoPermissionsGranted = this.videoPermissionStatus.state === 'granted'
    },
    async fetchMember(id) {
      const { getUser: User } = await this.$api.getUser({ id })
      return { User }
    }
  },
}
</script>

<style lang="scss" scoped>
.xo-video-body {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: 190px;
  gap: 8px;
  padding: 8px;

  &.more {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 100px;
  }

  .member {
    position: relative;
    background-color: #242424;
    border-radius: 4px;
    display: grid;
    place-content: center;

    &.placeholder {
      background-color: #385960;
      display: grid;
      place-content: center;
    }

    .avatar {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    .name {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 2;
      padding: 2px 5px 0;
      background-color: #000;
      border-bottom-left-radius: 4px;

      font-size: 12px;
      letter-spacing: -0.48px;

      display: flex;
      gap: 4px;
      align-items: center;

      .muted {
        background: url('~assets/images/explore-event/muted.svg') no-repeat
          center;
        background-color: transparent;
        background-size: 12px 12px;
        height: 12px;
        width: 12px;
        display: inline-block;
      }
    }
  }

  .audio {
    display: none;
  }
}
</style>
