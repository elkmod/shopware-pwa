import { useUser } from '@shopware-pwa/composables'
const LOGIN_ROUTE_NAME = 'login'
const LOGIN_ROUTE_PATH = '/login'
const PAGES_FOR_LOGGED_IN_ONLY = [
  'account' // user's account page
]

/**
 * 1. Check if requesting route is restricted only for authenticated user
 * 2. Redirect to /login otherwise (always force logout on /login route)
 */
export default async function({ route, redirect }) {
  const { isLoggedIn, logout } = useUser()

  if (route.name === LOGIN_ROUTE_NAME) {
    await logout()
  }

  if (
    PAGES_FOR_LOGGED_IN_ONLY.includes(route.name) &&
    isLoggedIn &&
    !isLoggedIn.value
  ) {
    redirect(LOGIN_ROUTE_PATH)
  }
}
