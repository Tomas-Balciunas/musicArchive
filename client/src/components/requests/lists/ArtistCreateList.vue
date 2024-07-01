<script lang="ts" setup>
import { tryCatch } from '@/composables'
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { RouterLink } from 'vue-router'

const r = ref()

onBeforeMount(async () => {
  tryCatch(async () => {
    r.value = await trpc.request.create.find.query('ARTIST')
  })
})
</script>

<template>
  <div v-if="r">
    <div v-for="req in r" :key="req.id">
      <RouterLink :to="{ name: 'ArtistCreateReq', params: { id: req.id } }">
        <v-card class="bandList">
          <v-card-item>
            <v-card-title>
              {{ req.data.name }}
            </v-card-title>
            <v-card-subtitle> {{ req.createdAt }} </v-card-subtitle>
          </v-card-item>
        </v-card>
      </RouterLink>
    </div>
  </div>
</template>
