<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const rId = Number(route.params.id)
const r = ref()

const approveChanges = async () => {
  await trpc.band.update.mutate({
    ...r.value.updated,
    bandId: r.value.band.id,
    artists: r.value.artists,
  })
  await trpc.band.request.update.status.mutate({ id: rId, status: 'approved' })
}

const rejectChanges = async () => {
  await trpc.band.request.update.status.mutate({ id: rId, status: 'rejected' })
}

onBeforeMount(async () => {
  r.value = await trpc.band.request.update.get.query(rId)
})
</script>

<template>
  <div v-if="r">
    <h1>
      <RouterLink :to="{ name: 'Band', params: { id: r.band.id } }">{{ r.band.name }}</RouterLink>
    </h1>
    <div v-for="(c, i) in r.changes" :key="i">
      <h4>{{ i }}:</h4>
      <p>Old: {{ c.old }}</p>
      <p>
        <span>New: </span><span class="bg-green">{{ c.new }}</span>
      </p>
    </div>
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
