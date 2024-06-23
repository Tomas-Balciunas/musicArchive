<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import type { ArtistBare, SongInsert } from '@mono/server/src/shared/entities'
import { useRoute } from 'vue-router'
import { tryCatch } from '@/composables'

const album = ref()
const currentArtists = ref()
const currentSongs = ref()
const route = useRoute()
const albumId = Number(route.params.id)

const searchResults = ref<ArtistBare[]>([])
const searchForm = ref('')

const songList = ref<Omit<SongInsert, 'album'>[]>([])
const artistList = ref<Pick<ArtistBare, 'id' | 'name'>[]>([])
const info = ref('')

const toSeconds = () => {
  return parseInt(songForm.value.minutes) * 60 + parseInt(songForm.value.seconds)
}

const songForm = ref({
  title: '',
  minutes: '',
  seconds: '',
})

const addSong = () => {
  songList.value.push({ title: songForm.value.title, duration: toSeconds() })
}

const removeArtist = (i: number) => {
  artistList.value.splice(i, 1)
}

const removeSong = (i: number) => {
  songList.value.splice(i, 1)
}

const toMinutes = (duration: number) => {
  const min = Math.floor(duration / 60)
  const sec = duration % 60

  return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`
}

const addArtist = async (artistId: number, name: string) => {
  searchForm.value = ''
  searchResults.value = []
  artistList.value.push({ id: artistId, name })
}

const search = async () => {
  if (searchForm.value === '') {
    searchResults.value = []
  } else {
    searchResults.value = await trpc.artist.search.query({ name: searchForm.value, albumId })
  }
}

function submitChanges() {
  //   if (album.value) {
  //     trpc.album.update.mutate({ albumId, artists: artistList.value, ...album.value })
  //   }
}

function submitRequest() {
  if (album.value) {
    tryCatch(async () => {
      await trpc.request.update.add.mutate({
        ...album.value,
        entity: 'ALBUM',
        entityId: albumId,
        artists: artistList.value,
        songs: songList.value,
        info: info.value,
      })
    })
  }
}

onBeforeMount(async () => {
  const { artists, songs, ...data } = await trpc.album.get.query(albumId)
  currentArtists.value = artists
  currentSongs.value = songs
  album.value = data
})
</script>

<template>
  <div v-if="album">
    <v-text-field v-model="album.title"></v-text-field>
    <v-number-input v-model="album.released"></v-number-input>

    <div class="d-flex">
        <div>
            <p v-for="a in currentArtists" :key="a.id">{{ a.name }}</p>
        </div>
        <div>
            <p v-for="s in currentSongs" :key="s.id">{{ s.title }} {{ toMinutes(s.duration) }}</p>
        </div>
    </div>

    <div v-for="a in artistList" :key="a.id">
      <span>{{ a.name }}</span>
    </div>
    <div v-for="s in songList" :key="s.title">
      <span>{{ s.title }}</span>
    </div>

    <div class="d-flex">
        <div class="borderBox">
          <p v-for="(a, i) in artistList" :key="a.id">
            {{ a.name }} <span @click.prevent="removeArtist(i)" class="bg-red">X</span>
          </p>
        </div>

        <div class="borderBox">
          <p v-for="(s, i) in songList" :key="i">
            {{ s.title }} {{ toMinutes(s.duration) }}
            <span @click.prevent="removeSong(i)" class="bg-red">X</span>
          </p>
        </div>
      </div>

    <v-textarea
      v-model="info"
      label="Provide source(s) and/or clarification for the changes."
      variant="solo-filled"
    ></v-textarea>

    <v-btn @click.prevent="submitChanges()">Update</v-btn>
    <v-btn @click.prevent="submitRequest()">Submit</v-btn>

    <div class="d-flex">
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
    </div>
  </div>
</template>
