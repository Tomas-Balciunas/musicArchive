<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const rId = Number(route.params.id)
const r = ref()

const approveChanges = async () => {
  await trpc.album.create.mutate({
    ...r.value,
    bandId: r.value.band.id,
    artists: r.value.artists,
    songs: r.value.songs
  })
  await trpc.album.request.create.status.mutate({ id: rId, status: 'approved' })
}

const rejectChanges = async () => {
  await trpc.album.request.create.status.mutate({ id: rId, status: 'rejected' })
}

onBeforeMount(async () => {
  r.value = await trpc.album.request.create.get.query(rId)
})
</script>

<template>
    {{ r }}
  <div v-if="r">
    <h2>
      <RouterLink :to="{ name: 'Band', params: { id: r.band.id } }">{{ r.band.name }}</RouterLink>
    </h2>
    <p>title: {{ r.title }}</p>
    <div v-if="r.artists.length">
      <h4>artists:</h4>
      <div v-for="a in r.artists" :key="a.id">
        <RouterLink :to="{ name: 'Artist', params: { id: a.id } }"
          ><p>
            <span class="bg-green">{{ a.name }}</span>
          </p></RouterLink
        >
      </div>
    </div>
    <div>
      <h4>Sources/explanation:</h4>
      <p>{{ r.info }}</p>
    </div>
    <v-btn @click.prevent="approveChanges">Approve</v-btn>
    <v-btn @click.prevent="rejectChanges">Reject</v-btn>
  </div>
</template>
