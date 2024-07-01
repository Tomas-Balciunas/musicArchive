<script lang="ts" setup>
import { ref } from 'vue'
import type { ArtistBare, SongInsert } from '@mono/server/src/shared/entities'
import { tryCatch } from '@/composables'
import { trpc } from '@/trpc'
import { useRoute } from 'vue-router'
import { onBeforeMount } from 'vue'
import { useNotifStore } from '@/stores/notif'

const route = useRoute()
const bandId = Number(route.params.id)
const band = ref()
const notifStore = useNotifStore()

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

const toMinutes = (duration: number) => {
  const min = Math.floor(duration / 60)
  const sec = duration % 60

  return `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`
}

const albumForm = ref({
  title: '',
  released: null,
})
const artistList = ref<Pick<ArtistBare, 'id' | 'name'>[]>([])
const songList = ref<Omit<SongInsert, 'album'>[]>([])

const addArtist = async (artistId: number, name: string) => {
  searchForm.value = ''
  searchResults.value = []
  if (artistList.value.every((a) => a.id !== artistId)) {
    artistList.value.push({ id: artistId, name })
  } else {
    notifStore.showNotif('This artist has already been added')
  }
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

const removeArtist = (i: number) => {
  artistList.value.splice(i, 1)
}

const removeSong = (i: number) => {
  songList.value.splice(i, 1)
}

const submitAlbum = () => {
  tryCatch(async () => {
    await trpc.request.create.add.mutate({
      entity: 'ALBUM',
      ...albumForm.value,
      artists: artistList.value,
      songs: songList.value,
      bandId,
      info: 'test',
    })
  })
}

onBeforeMount(async () => {
  band.value = await trpc.band.get.query(bandId)
})
</script>

<template>
  {{ band }}
  <div v-if="band">
    <RouterLink :to="{ name: 'Band', params: { id: band.id } }">
      <h4>{{ band.name }}</h4>
    </RouterLink>
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
      <p>Band line-up:</p>
      <div v-if="band.artists">
        <div v-for="artist in band.artists" :key="artist.id">
          <v-checkbox
            hide-details
            density="compact"
            v-model="artistList"
            :label="artist.name"
            :value="{ id: artist.id, name: artist.name }"
          ></v-checkbox>
        </div>
      </div>
      <h5 v-else>No artists available</h5>
    </div>
  </div>
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
  <v-btn>Create</v-btn>
  <v-btn @click.prevent="submitAlbum">Submit</v-btn>
</template>
