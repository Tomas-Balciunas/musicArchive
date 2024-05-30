<script setup lang="ts">
import { watch, ref } from 'vue'
import { useNotifStore } from '@/stores/notif'

const notif = useNotifStore()

watch(
  () => notif.notif,
  () => {
    active.value = true
  }
)

const active = ref(false)
</script>

<template>
  <div id="notif">
    <v-alert v-model="active" type="info" title="Alert title" variant="tonal" closable @click:close="active = false">
      <template v-slot:title>
        {{ notif.getNotif }}
      </template>
    </v-alert>
  </div>
</template>
<style scoped>
#notif {
  bottom: 0;
  width: 100%;
  position: fixed;
}
</style>
