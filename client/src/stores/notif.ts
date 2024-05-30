import { defineStore } from 'pinia'

export const useNotifStore = defineStore('notif', {
  state: () => ({
    notif: '',
  }),
  getters: {
    getNotif(): string {
      return this.notif
    },
  },
  actions: {
    showNotif(msg: string) {
      this.notif = msg
    },
  },
})
