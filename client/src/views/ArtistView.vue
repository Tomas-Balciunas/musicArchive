<script lang="ts" setup>
import { trpc } from '@/trpc'
import type { ArtistFull } from '@mono/server/src/shared/entities'
import { onBeforeMount } from 'vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const artist = ref<ArtistFull>()
const artistId = Number(route.params.id)

onBeforeMount(async () => {
  artist.value = await trpc.artist.get.query(artistId)
})
</script>

<template>
  <div v-if="artist">
    <h3>{{ artist.name }}</h3>
    <p>Birth date:{{ artist.birth ?? 'N/A' }}</p>
    <h4>Bands:</h4>
    <p v-for="band in artist.bands" :key="band.id">
      <RouterLink :to="{ name: 'Band', params: { id: band.id } }">{{ band.name }}</RouterLink>
    </p>
    <h4>Albums:</h4>
    <p v-for="album in artist.albums" :key="album.id">
      <RouterLink :to="{ name: 'Album', params: { id: album.id } }">{{ album.title }}</RouterLink>
    </p>
  </div>
</template>
