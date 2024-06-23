<script lang="ts" setup>
import { trpc } from '@/trpc'
import { useRoute } from 'vue-router'
import { onBeforeMount, ref } from 'vue'
import { type AlbumFull } from '@mono/server/src/shared/entities'
import { isLoggedIn } from '@/stores/user'

const route = useRoute()
const album = ref<AlbumFull>()
const albumId = Number(route.params.id)

const toMinutes = (duration: number) => {
  const min = Math.floor(duration / 60)
  const sec = duration % 60

  return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`
}

const updateAlbum = async () => {
  album.value = await trpc.album.get.query(albumId)
}

onBeforeMount(async () => {
  await updateAlbum()
})
</script>

<template>
  <div v-if="album">
    <RouterLink :to="{ name: 'AlbumUpdate', params: { id: albumId } }"
      ><v-btn>Update</v-btn></RouterLink
    >
    <div class="borderBox">
      <h1>{{ album.title }}</h1>
      <RouterLink :to="{ name: 'Band', params: { id: album.band.id } }">
        <h3>{{ album.band.name }}</h3>
      </RouterLink>
      <h4>{{ album.released }}</h4>
    </div>

    <div class="borderBox">
      <h3>Artists:</h3>
      <div v-if="album.artists.length">
        <div v-for="artist in album.artists" :key="artist.id">
          <RouterLink :to="{ name: 'Artist', params: { id: artist.id } }">
            <p>{{ artist.name }}</p>
          </RouterLink>
        </div>
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
    <div class="d-flex"></div>
    <div v-if="isLoggedIn">
      <RouterLink :to="{ name: 'ReviewCreate', params: { id: albumId } }">
        <div class="gap-3">
          <v-btn type="submit" color="#C62828">Write a review</v-btn>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style></style>
