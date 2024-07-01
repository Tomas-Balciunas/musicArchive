import { useUserStore } from '@/stores/user'


export const authenticate = () => {
  const userStore = useUserStore()

  if (!userStore.isLoggedIn) return { name: 'Login' }

  return true
}
