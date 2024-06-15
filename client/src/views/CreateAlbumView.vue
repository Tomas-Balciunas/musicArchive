<script lang="ts" setup>
import { type Ref, ref } from 'vue'
import type { AlbumInsert, ArtistBare, SongInsert } from '@mono/server/src/shared/entities'
import { makeInsert, tryCatch } from '@/composables'
import { trpc } from '@/trpc'
import { useRoute } from 'vue-router'

const route = useRoute()
const bandId = Number(route.params.id)

const toSeconds = () => {
  return parseInt(songForm.value.minutes) * 60 + parseInt(songForm.value.seconds)
}

const toMinutes = (duration: number) => {
  const min = Math.floor(duration / 60)
  const sec = duration % 60

  return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`
}

const songForm = ref({
  title: '',
  minutes: '',
  seconds: '',
})

const addSong = () => {
  songList.value.push({ title: songForm.value.title, duration: toSeconds() })
}

const albumForm = ref({
  title: '',
  released: null
})
const artistList = ref<Pick<ArtistBare, 'id' | 'name'>[]>([])
const songList = ref<Omit<SongInsert, 'albumId'>[]>([])
const info = ref('info')

const addArtist = async (artistId: number, name: string) => {
  searchForm.value = ''
  searchResults.value = []
  artistList.value.push({ id: artistId, name })
}
const searchResults = ref<ArtistBare[]>([])
const searchForm = ref('')

const search = async () => {
  if (searchForm.value === '') {
    searchResults.value = []
  } else {
    searchResults.value = await trpc.artist.search.query({ name: searchForm.value, bandId })
  }
}

const albumInsert: Ref<AlbumInsert> = makeInsert(albumForm.value, {
  artists: artistList.value,
  songs: songList.value,
  bandId,
})

const submitAlbum = () => {
  tryCatch(async () => {
    await trpc.album.request.create.add.mutate({ ...albumInsert.value, artists: artistList.value,
  songs: songList.value,
  bandId, info: info.value })
  })
}
</script>

<template>
  {{ albumInsert }}
  <div>
    <div>
      <p class="text-center">Create album</p>
      <div>
        <v-text-field label="Album title" variant="solo-filled" v-model="albumForm.title" />
        <v-number-input
            type="number"
            v-model="albumForm.released"
            variant="solo-filled"
            placeholder="Year released"
          />
      </div>

      <p>Artist line-up (optional):</p>
      <!-- <div v-if="band.artists.length">
            <div v-for="artist in band.artists" :key="artist.id">
              <v-checkbox
                hide-details
                density="compact"
                v-model="albumForm.artistList"
                :label="artist.name"
                :value="artist.id"
              ></v-checkbox>
            </div>
          </div>
          <h5 v-else>No artists available</h5> -->

    </div>
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
      <v-btn type="button" color="#C62828" @click="addArtist(artist.id, artist.name)">+</v-btn>
    </div>
  </div>

  <div class="borderBox createBox">
    <p class="text-center">Add song</p>
    <div>
      <v-text-field label="Song title" variant="solo-filled" v-model="songForm.title" />
    </div>
    <div class="timeBox">
      <v-text-field
        type="number"
        label="Minutes"
        variant="solo-filled"
        v-model="songForm.minutes"
      />
      <v-text-field
        type="number"
        label="Seconds"
        variant="solo-filled"
        v-model="songForm.seconds"
      />
    </div>

    <v-btn @click.prevent="addSong" type="submit" color="#C62828">Save</v-btn>
  </div>
  <v-btn>Create</v-btn>
  <v-btn @click.prevent="submitAlbum">Submit</v-btn>
</template>
