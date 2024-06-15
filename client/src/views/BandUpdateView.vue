<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import type { ArtistBare, BandUpdate } from '@mono/server/src/shared/entities'
import { getCountryDataList } from 'countries-list'
import { useRoute } from 'vue-router'

const band = ref<Omit<BandUpdate, 'artists'>>()
const currentArtists = ref()
const route = useRoute()
const bandId = Number(route.params.id)
const countryList = ref<string[]>([])

const searchResults = ref<ArtistBare[]>([])
const searchForm = ref('')

const artistList = ref<Pick<ArtistBare, 'id' | 'name'>[]>([])
const info = ref('')

const addArtist = async (artistId: number, name: string) => {
  searchForm.value = ''
  searchResults.value = []
  artistList.value.push({ id: artistId, name })
}

const search = async () => {
  if (searchForm.value === '') {
    searchResults.value = []
  } else {
    searchResults.value = await trpc.artist.search.query({ name: searchForm.value, bandId })
  }
}

function submitChanges() {
  if (band.value) {
    trpc.band.update.mutate({ bandId, artists: artistList.value, ...band.value })
  }
}

function submitRequest() {
  if (band.value) {
    trpc.band.request.update.create.mutate({
      bandId,
      artists: artistList.value,
      info: info.value,
      ...band.value,
    })
  }
}

onBeforeMount(async () => {
  countryList.value = getCountryDataList().map((c) => c.name)
  const { artists, ...data } = await trpc.band.get.query(bandId)
  currentArtists.value = artists
  band.value = data
})
</script>

<template>
  <div v-if="band">
    <v-text-field v-model="band.name"></v-text-field>
    <v-text-field v-model="band.description"></v-text-field>
    <v-number-input v-model="band.formed"></v-number-input>
    <v-select
      clearable
      v-model="band.origin"
      :items="countryList"
      variant="solo-filled"
      label="Country of origin"
    ></v-select>

    <div v-for="artist in currentArtists" :key="artist.id">
      <span>{{ artist.name }}</span>
    </div>
    <div v-for="artist in artistList" :key="artist.id">
      <span>{{ artist.name }}</span>
    </div>
    <div></div>

    <v-textarea v-model="info" label="Provide source(s) and/or clarification for the changes." variant="solo-filled"></v-textarea>

    <v-btn @click.prevent="submitChanges()">Update</v-btn>
    <v-btn @click.prevent="submitRequest()">Submit</v-btn>
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
</template>
