<template lang="pug">
.xo-video(ref="video", v-show="!isHidden")
</template>

<script>
import { Participant } from 'twilio-video'

export default {
  name: 'XOVideo',
  props: {
    participant: {
      type: Participant,
      required: true,
    },
  },
  data() {
    return {
      isHidden: false,
      publication: null,
      track: null,
      videoElem: null,
    }
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
  },
  mounted() {
    const publication = [...this.participant.videoTracks.values()][0]
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
      this.videoElem = track.attach()
      this.$refs.video.replaceChildren(this.videoElem)
    },
    detachTrack() {
      this.videoElem?.remove()
      this.videoElem = null
    },
    handleTrackPublished(publication) {
      if (publication.kind !== 'video') return

      this.publication = publication
    },
    handleTrackDisabled() {
      this.isHidden = true
    },
    handlePublicationSubscribed(track) {
      this.isHidden = false
      this.track = track
    },
    handlePublicationUnsubscribed() {
      this.detachTrack()
    },
  },
}
</script>

<style lang="scss" scoped>
.xo-video {
  overflow: hidden;
  border-radius: 4px;
  transform: scale(-1, 1);
  z-index: 1;
}
</style>
