<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { RouterLink } from 'vue-router'

const r = ref()

onBeforeMount(async () => {
  r.value = await trpc.request.update.find.query('BAND')
})
</script>

<template>
  <div v-if="r">
    <div v-for="req in r" :key="req.id">
      <RouterLink :to="{ name: 'BandUpdateReq', params: { id: req.id } }">
        <v-card class="bandList">
          <v-card-item>
            <v-card-title>{{ req.band_name }}</v-card-title>
            <v-card-subtitle>
              {{ req.created_at }}
            </v-card-subtitle>
          </v-card-item>
        </v-card>
      </RouterLink>
    </div>
  </div>
</template>
