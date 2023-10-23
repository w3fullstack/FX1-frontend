import type { Room } from 'twilio-video'
import type { Dictionary } from 'lodash'
import { createLocalAudioTrack, createLocalVideoTrack } from 'twilio-video'
import groupBy from 'lodash/groupBy'

export async function getUserMedia() {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { facingMode: 'user' },
    })

    const audioId = mediaStream.getAudioTracks()?.[0].getSettings().deviceId
    const videoId = mediaStream.getVideoTracks()?.[0].getSettings().deviceId

    return {
      audioId,
      videoId,
    }
  } catch (e) {
    return { audioId: null, videoId: null }
  }
}

export async function getMediaDevices(): Promise<
  Dictionary<MediaDeviceInfo[]>
> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    return groupBy(devices, (device) => device.kind)
  } catch (e) {
    return {}
  }
}

export async function switchAudioDevice(
  room: Room,
  deviceId?: string
): Promise<string | undefined> {
  const track = await createLocalAudioTrack(deviceId ? { deviceId: { exact: deviceId } } : {})

  room.localParticipant.audioTracks.forEach((publication) => {
    publication.track.stop()
    room.localParticipant.unpublishTrack(publication.track)
  })

  await room.localParticipant.publishTrack(track)

  return track.mediaStreamTrack.getSettings().deviceId
}

export async function switchVideoDevice(
  room: Room,
  deviceId?: string
): Promise<string | undefined> {
  const track = await createLocalVideoTrack(deviceId ? { deviceId: { exact: deviceId } } : { facingMode: 'user' })

  room.localParticipant.videoTracks.forEach((publication) => {
    publication.track.stop()
    room.localParticipant.unpublishTrack(publication.track)
  })

  await room.localParticipant.publishTrack(track)

  return track.mediaStreamTrack.getSettings().deviceId
}

export function muteLocalAudio(
  room: Room
): void {
  room.localParticipant.audioTracks.forEach((publication) => {
    publication.track.disable()
  })
}

export function muteLocalVideo(
  room: Room
): void {
  room.localParticipant.videoTracks.forEach((publication) => {
    publication.track.disable()
  })
}

export function unmuteLocalAudio(
  room: Room
): void {
  room.localParticipant.audioTracks.forEach((publication) => {
    publication.track.enable()
  })
}

export function unmuteLocalVideo(
  room: Room
): void {
  room.localParticipant.videoTracks.forEach((publication) => {
    publication.track.enable()
  })
}
