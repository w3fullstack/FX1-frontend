<template lang="pug">
.xo-audio(ref="audio")
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { Participant } from 'twilio-video'

export default {
  name: 'XOAudio',
  props: {
    participant: {
      type: Participant,
      required: true,
    },
  },
  data() {
    return {
      publication: null,
      track: null,
      audioElem: null,
    }
  },
  computed: {
    ...mapFields('chats', [
      'audioOutputDeviceId',
    ]),
  },
  watch: {
    publication(newPublication, oldPublication) {
      oldPublication?.off('subscribed', this.handlePublicationSubscribed)
      oldPublication?.off('unsubscribed', this.handlePublicationUnsubscribed)

      if (newPublication.track) {
        this.handlePublicationSubscribed(newPublication.track)
      }

      newPublication.on('subscribed', this.handlePublicationSubscribed)
      newPublication.on('unsubscribed', this.handlePublicationUnsubscribed)
    },
    track(newTrack, oldTrack) {
      oldTrack?.off('disabled', this.handleTrackDisabled)

      this.attachTrack(newTrack)

      newTrack.on('disabled', this.handleTrackDisabled)
    },
    audioOutputDeviceId(newVal) {
      this.setAudioOutput(newVal)
    },
  },
  mounted() {
    const publication = [...this.participant.audioTracks.values()][0]
    if (publication) {
      this.handleTrackPublished(publication)
    }

    this.participant.on('trackPublished', this.handleTrackPublished)
  },
  beforeDestroy() {
    this.detachTrack()
  },
  methods: {
    attachTrack(track) {
      this.audioElem = track.attach()
      this.setAudioOutput(this.audioOutputDeviceId)
      this.$refs.audio.replaceChildren(this.audioElem)
    },
    detachTrack() {
      this.audioElem?.remove()
      this.audioElem = null
    },
    handleTrackPublished(publication) {
      if (publication.kind !== 'audio') return

      this.publication = publication
    },
    handleTrackDisabled() {
      this.$emit('audioMute')
    },
    handlePublicationSubscribed(track) {
      this.$emit('audioUnmute')
      this.track = track
    },
    handlePublicationUnsubscribed() {
      this.detachTrack()
    },
    setAudioOutput(deviceId) {
      // NOTE: setSinkId is currently not supported in Safari
      if (this.audioElem?.setSinkId && deviceId) {
        this.audioElem.setSinkId(deviceId)
      }
    },
  },
}
</script>
