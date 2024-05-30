import { useNotifStore } from '@/stores/notif'
import { computed } from 'vue'

const notifStore = useNotifStore()

export function makeInsert(formValue: any, ...args: any) {
  return computed(() => {
    return { ...formValue, ...args[0] }
  })
}

// needs typescript

export async function tryCatch(fn: Function) {
  try {
    const res = await fn()
    return res
  } catch (error) {
    notifStore.showNotif(error as string)
  }
}
