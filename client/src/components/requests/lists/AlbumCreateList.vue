<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { RouterLink } from 'vue-router'

const r = ref()

onBeforeMount(async () => {
  r.value = await trpc.request.create.find.query('ALBUM')
})
</script>

<template>
  <v-card v-if="r">
    <div v-for="req in r" :key="req.id">
      <RouterLink :to="{ name: 'AlbumCreateReq', params: { id: req.id } }">
        <v-card class="bandList">
          <v-card-item>
            <v-card-title>
              {{ req.data.title }}
            </v-card-title>
            <v-card-subtitle> {{ req.createdAt }} {{}} </v-card-subtitle>
          </v-card-item>
        </v-card>
      </RouterLink>
    </div>
  </v-card>
</template>
