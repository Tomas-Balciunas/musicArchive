<script lang="ts" setup>
import { trpc } from '@/trpc'
import { useRoute } from 'vue-router'
import { computed, onBeforeMount, ref } from 'vue'
import { type AlbumFull } from '@mono/server/src/shared/entities'
import { tryCatch } from '@/composables'

const route = useRoute()
const album = ref<AlbumFull>()
const albumId = Number(route.params.id)

const toSeconds = computed(() => {
  return parseInt(songTime.value.minutes) * 60 + parseInt(songTime.value.seconds)
})

const toMinutes = (duration: number) => {
  const min = Math.floor(duration / 60)
  const sec = duration % 60
  return `${min}:${sec}`
}

const songTime = ref({
  minutes: '',
  seconds: '',
})

const songForm = ref({
  title: '',
  duration: toSeconds,
  albumId,
})

const createSong = () => {
  tryCatch(async () => {
    await trpc.song.create.mutate(songForm.value)
  })
}

onBeforeMount(async () => {
  const result = await trpc.album.get.query(albumId)
  album.value = result
})
</script>

<template>
  <div v-if="album">
    <div class="borderBox">
      <h1>{{ album.title }}</h1>
      <RouterLink :to="{ name: 'Band', params: { id: album.band.id } }">
        <h3>{{ album.band.name }}</h3>
      </RouterLink>
    </div>

    <div class="borderBox">
      <h3>Artists:</h3>
      <div v-if="album.artists.length">
        <p v-for="artist in album.artists" :key="artist.id">{{ artist.name }}</p>
      </div>
    </div>

    <div class="borderBox">
      <h3>Song list:</h3>
      <div v-if="album.songs.length">
        <p v-for="song in album.songs" :key="song.id">
          {{ song.title }} {{ toMinutes(song.duration) }}
        </p>
      </div>
      <h5 v-else>No songs found</h5>
    </div>

    <div class="borderBox">
      <h3>Reviews:</h3>
      <div v-if="album.reviews.length">
        <div v-for="review in album.reviews" :key="review.id">
          <RouterLink :to="{ name: 'Review', params: { id: review.id } }"
            ><p>{{ review.score }}% {{ review.title }}</p></RouterLink
          >
        </div>
      </div>
      <h5 v-else>No reviews found</h5>
    </div>

    <div class="borderBox createBox">
      <form @submit.prevent="createSong">
        <p class="text-center">Add song</p>
        <div>
          <v-text-field label="Song title" variant="solo-filled" v-model="songForm.title" />
        </div>
        <div class="timeBox">
          <v-text-field
            type="number"
            label="Minutes"
            variant="solo-filled"
            v-model="songTime.minutes"
          />
          <v-text-field
            type="number"
            label="Seconds"
            variant="solo-filled"
            v-model="songTime.seconds"
          />
        </div>

        <div class="gap-3">
          <v-btn type="submit" color="#C62828">Save</v-btn>
        </div>
      </form>
    </div>

    <RouterLink :to="{ name: 'ReviewCreate', params: { id: albumId } }">
      <div class="gap-3">
        <v-btn type="submit" color="#C62828">Write a review</v-btn>
      </div>
    </RouterLink>
  </div>
</template>

<style></style>
