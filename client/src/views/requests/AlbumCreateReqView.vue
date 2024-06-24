<script lang="ts" setup>
import { tryCatch } from '@/composables'
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const rId = Number(route.params.id)
const r = ref()
const b = ref()

const toMinutes = (duration: number) => {
  const min = Math.floor(duration / 60)
  const sec = duration % 60

  return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`
}

const approveChanges = async () => {
  tryCatch(async () => {
    await trpc.request.create.approve.mutate({
      id: rId,
      ...r.value.data,
      bandId: r.value.data.bandId,
      artists: r.value.data.artists,
      songs: r.value.data.songs,
      entity: r.value.entity,
    })
    
    router.push({name: 'Requests'})
  })
}

const rejectChanges = async () => {
  await trpc.request.create.reject.mutate(rId)
}

onBeforeMount(async () => {
  r.value = await trpc.request.create.get.query(rId)
  b.value = await trpc.band.get.query(r.value.data.bandId)
})
</script>

<template>
  <div v-if="r && b">
    <h2>
      <RouterLink :to="{ name: 'Band', params: { id: b.id } }">{{ b.name }}</RouterLink>
    </h2>
    <h3>title: {{ r.data.title }}</h3>
    <h3>released in: {{ r.data.released }}</h3>
    <div v-if="r.data.artists.length">
      <h4>artists:</h4>
      <div v-for="a in r.data.artists" :key="a.id">
        <RouterLink :to="{ name: 'Artist', params: { id: a.id } }"
          ><p>
            <span>{{ a.name }}</span>
          </p></RouterLink
        >
      </div>
    </div>

    <div v-if="r.data.songs.length">
      <h4>songs:</h4>
      <p v-for="s in r.data.songs" :key="s.id">{{ s.title }} {{ toMinutes(s.duration) }}</p>
    </div>
    <div>
      <h4>Sources/explanation:</h4>
      <p>{{ r.info }}</p>
    </div>
    <v-btn @click.prevent="approveChanges">Approve</v-btn>
    <v-btn @click.prevent="rejectChanges">Reject</v-btn>
  </div>
</template>
