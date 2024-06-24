<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const rId = Number(route.params.id)
const r = ref()
const a = ref()

const approveChanges = async () => {
  await trpc.request.update.approve.mutate({id: r.value.id, entity: 'ARTIST'})
}

const rejectChanges = async () => {
  await trpc.request.update.reject.mutate(rId)
}

onBeforeMount(async () => {
  r.value = await trpc.request.update.get.query(rId)
  a.value = await trpc.artist.get.query(r.value.entityId)
})
</script>

<template>
  <div v-if="r && a">
    <h1>
      <RouterLink :to="{ name: 'Artist', params: { id: a.id } }">{{ a.name }}</RouterLink>
    </h1>
    <div v-for="(c, i) in r.comparison" :key="i">
      <h4>{{ i }}:</h4>
      <p>Old: {{ c.old }}</p>
      <p>
        <span>New: </span><span class="bg-green">{{ c.new }}</span>
      </p>
    </div>
    <div>
      <h4>Sources/explanation:</h4>
      <p>{{ r.info }}</p>
    </div>
    <v-btn @click.prevent="approveChanges">Approve</v-btn>
    <v-btn @click.prevent="rejectChanges">Reject</v-btn>
  </div>
</template>
