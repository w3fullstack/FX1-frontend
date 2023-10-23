import { Context } from '@nuxt/types/app'

export default function(this: Context, { topicName }: any) {
  if (!this.$fire.messaging) return
  this.$fire.messaging.getToken().then((currentToken) => {
    if (currentToken) {
      fetch('https://iid.googleapis.com/iid/v1/'+currentToken+'/rel/topics/'+topicName, {
        method: 'POST',
        headers: new Headers({
          'Authorization': 'key=' + process.env.FCM_SERVER_KEY
        })
      }).then(response => {
        if (response.status < 200 || response.status >= 400) {
          // eslint-disable-next-line no-throw-literal
          throw 'Error subscribing to topic: '+response.status + ' - ' + response.text();
        }
        console.log('FCM Subscribed to "'+topicName+'"');
      }).catch(error => {
        console.error(error);
      })
    }
  })
}
