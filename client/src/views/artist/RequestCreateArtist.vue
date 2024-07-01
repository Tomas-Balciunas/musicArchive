<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const rId = Number(route.params.id)
const r = ref()

const approveChanges = async () => {
  await trpc.request.create.approve.mutate({ id: rId, entity: 'ARTIST' })
}

const rejectChanges = async () => {
  await trpc.request.create.reject.mutate(rId)
}

onBeforeMount(async () => {
  r.value = await trpc.request.create.get.query(rId)
})
</script>

<template>
  <div v-if="r">
    <h3>name: {{ r.data.name }}</h3>
    <h3>birth: {{ r.data.birth ?? 'N/A' }}</h3>
    <div>
      <h4>Sources/explanation:</h4>
      <p>{{ r.info }}</p>
    </div>
    <v-btn @click.prevent="approveChanges">Approve</v-btn>
    <v-btn @click.prevent="rejectChanges">Reject</v-btn>
  </div>
</template>
