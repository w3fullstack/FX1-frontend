import type { Room } from 'twilio-video'
import { connect } from 'twilio-video'

interface ConnectToRoomArgs {
  token: string
  roomName: string
  audioDeviceId?: string | null
  videoDeviceId?: string | null
}

interface ConnectToRoomWithoutDevicesArgs {
  token: string
  roomName: string
}

export function connectToRoom({ token, roomName, audioDeviceId, videoDeviceId }: ConnectToRoomArgs): Promise<Room> {
  return connect(token, {
    name: roomName,
    audio: {
      deviceId: audioDeviceId || undefined,
    },
    video: {
      deviceId: videoDeviceId || undefined,
      facingMode: 'user',
    },
  })
}

export function connectToRoomWithoutDevices({ token, roomName }: ConnectToRoomWithoutDevicesArgs): Promise<Room> {
  return connect(token, {
    name: roomName,
    audio: false,
    video: false,
  })
}
