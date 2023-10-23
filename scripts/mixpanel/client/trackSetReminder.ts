import { Context } from '@nuxt/types/app'

export default function(this: Context, { lockerRoom, game }: any) {
  try {
    const { platform: Platform } = this.app.$mixpanelClient.getTrackDefaults();
    this.app?.$mixpanel.track('Reminder Set' ,{
      ...{
        Sport: (lockerRoom?.Sports && lockerRoom?.Sports.length) ? lockerRoom?.Sports[0].name : game.sport,
        League: game.leagueCode?.toUpperCase(),
        Name: document.title,
        Platform,
      }
    })
  } catch (e) {
    console.log(e);
  }
}
