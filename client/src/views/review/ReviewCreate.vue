<script lang="ts" setup>
import { trpc } from '@/trpc'
import { useRoute } from 'vue-router'
import { onBeforeMount, ref } from 'vue'
import type { ReviewInsert } from '@mono/server/src/shared/entities'
import type { Ref } from 'vue'
import { makeInsert, tryCatch } from '@/composables'

const route = useRoute()
const albumId = Number(route.params.id)
const info = ref()
const reviewForm = ref({
  title: '',
  body: '',
  score: null,
})

const reviewInsert: Ref<ReviewInsert> = makeInsert(reviewForm.value, { albumId })

const createReview = () => {
  tryCatch(async () => {
    await trpc.review.create.mutate(reviewInsert.value)
  })
}

onBeforeMount(async () => {
  const result = await trpc.album.reviewData.query(albumId)
  info.value = result
})
</script>

<template>
  <div v-if="info">
    <RouterLink :to="{ name: 'Album', params: { id: albumId } }"
      ><h1>{{ info.title }}</h1></RouterLink
    >
    <RouterLink :to="{ name: 'Band', params: { id: info.band.id } }"
      ><h2>{{ info.band.name }}</h2></RouterLink
    >

    <form @submit.prevent="createReview">
      <v-text-field label="Title" v-model="reviewForm.title" variant="solo-filled"></v-text-field>
      <v-textarea label="Content" v-model="reviewForm.body" variant="solo-filled"></v-textarea>
      <VNumberInput
        label="Score (1 to 100)"
        type="number"
        :min="1"
        :max="100"
        prefix="%"
        v-model="reviewForm.score"
      ></VNumberInput>
      <v-btn type="submit" color="#C62828">Submit review</v-btn>
    </form>
  </div>
</template>

<style></style>
