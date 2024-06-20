<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const rId = Number(route.params.id)
const r = ref()
const b = ref()

const approveChanges = async () => {
  await trpc.request.update.approve.mutate({id: r.value.id, entity: 'BAND'})
}

const rejectChanges = async () => {
  await trpc.request.update.reject.mutate(rId)
}

onBeforeMount(async () => {
  r.value = await trpc.request.update.get.query(rId)
  b.value = await trpc.band.get.query(r.value.entityId)
})
</script>

<template>
  {{ r }}
  <div v-if="r && b">
    <h1>
      <RouterLink :to="{ name: 'Band', params: { id: b.id } }">{{ b.name }}</RouterLink>
    </h1>
    <div v-for="(c, i) in r.comparison" :key="i">
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
