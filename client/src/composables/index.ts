import { DEFAULT_SERVER_ERROR } from '@/consts'
import { useNotifStore } from '@/stores/notif'
import { TRPCClientError } from '@trpc/client'
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
    const msg = getErrorMessage(error)
    notifStore.showNotif(msg)
  }
}

function getErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return DEFAULT_SERVER_ERROR
  }

  if (!(error instanceof TRPCClientError)) {
    return error.message
  }

  return error.data.message || error.message
}
