export default async function ({ route, app, store, redirect }) {
  const { mode, oobCode: actionCode } = route.query

  switch (mode) {
    case 'resetPassword': {
        redirect(`/create-new-password?c=${actionCode}`)
      break
    }
  }
}
