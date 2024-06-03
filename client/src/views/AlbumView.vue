<script lang="ts" setup>
import { trpc } from '@/trpc'
import { useRoute } from 'vue-router'
import { computed, onBeforeMount, ref } from 'vue'
import { type AlbumFull, type ArtistBare } from '@mono/server/src/shared/entities'
import { tryCatch } from '@/composables'
import { isLoggedIn } from '@/stores/user'

const route = useRoute()
const album = ref<AlbumFull>()
const albumId = Number(route.params.id)
const searchResults = ref<ArtistBare[]>([])
const searchForm = ref('')

const toSeconds = computed(() => {
  return parseInt(songTime.value.minutes) * 60 + parseInt(songTime.value.seconds)
})

const toMinutes = (duration: number) => {
  const min = Math.floor(duration / 60)
  const sec = duration % 60

  return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`
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
    await updateAlbum()
  })
}

const addArtist = async (artistId: number) => {
  await trpc.artist.add.mutate({ albumId, artistId })
  await updateAlbum()
  searchForm.value = ''
  searchResults.value = []
}

const updateAlbum = async () => {
  album.value = await trpc.album.get.query(albumId)
}

const search = async () => {
  if (searchForm.value === '') {
    searchResults.value = []
  } else {
    searchResults.value = await trpc.artist.search.query({ name: searchForm.value, albumId })
  }
}

onBeforeMount(async () => {
  await updateAlbum()
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
    <div class="d-flex">
      <div class="borderBox createBox" v-if="isLoggedIn">
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

      <div class="borderBox createBox">
        <p class="text-center">Add artist</p>
        <div>
          <v-text-field
            label="Search for artists"
            variant="solo-filled"
            v-model="searchForm"
            @update:model-value="search"
          />
        </div>

        <div v-for="artist in searchResults" :key="artist.id">
          <span>{{ artist.name }}</span>
          <v-btn type="button" color="#C62828" @click="addArtist(artist.id)">+</v-btn>
        </div>
      </div>
    </div>
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
