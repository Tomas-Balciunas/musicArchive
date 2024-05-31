<script setup lang="ts">
import { trpc } from '@/trpc'
import { onBeforeMount, ref, type Ref } from 'vue'
import type {
  AlbumInsert,
  BandFull,
  ArtistBandInsert,
  PostInsert,
} from '@mono/server/src/shared/entities'
import { useRoute } from 'vue-router'
import { makeInsert, tryCatch } from '@/composables'
import { isLoggedIn } from '@/stores/user'

const band = ref<BandFull>()
const route = useRoute()
const bandId = Number(route.params.id)

const albumForm = ref({
  title: '',
  albumArtists: [],
})
const artistForm = ref({
  name: '',
  birth: null,
})

const postForm = ref({
  body: '',
})

const postInsert: Ref<PostInsert> = makeInsert(postForm.value, { bandId })
const albumInsert: Ref<AlbumInsert> = makeInsert(albumForm.value, { bandId })
const artistInsert: Ref<ArtistBandInsert> = makeInsert(artistForm.value, { bandId })

const createAlbum = () => {
  tryCatch(async () => {
    await trpc.album.create.mutate(albumInsert.value)
  })
}

const createArtist = () => {
  tryCatch(async () => {
    await trpc.artist.create.mutate(artistInsert.value)
  })
}

const createComment = () => {
  tryCatch(async () => {
    await trpc.post.create.mutate(postInsert.value)
  })
}

onBeforeMount(async () => {
  const result = await trpc.band.get.query(bandId)
  band.value = result
})
</script>

<template>
  <div v-if="band">
    <div class="borderBox">
      <h1>{{ band.name }}</h1>
      <p>{{ band.description }}</p>
    </div>

    <div v-if="band.artists.length" class="borderBox">
      <h3>Artists</h3>
      <div v-for="artist in band.artists" :key="artist.id">
        <p>{{ artist.name }}, Birth date: {{ artist.birth ?? 'N/A' }}</p>
      </div>
    </div>
    <h5 v-else>No artists found.</h5>

    <div class="borderBox">
      <div v-if="band.albums.length">
        <h3>Albums</h3>
        <div v-for="album in band.albums" :key="album.id">
          <RouterLink :to="{ name: 'Album', params: { id: album.id } }"
            ><p>{{ album.title }}</p></RouterLink
          >
        </div>
      </div>
      <h5 v-else>No albums found.</h5>
    </div>

    <div class="borderBox">
      <div v-if="band.posts.length">
        <h3>Comments</h3>
        <div v-for="post in band.posts" :key="post.id">
          <div class="commentBox">
            <div>
              <span
                >{{ post.user.username }} {{ String(post.createdAt).slice(0, 19).replace('T', ' ') }}</span
              >
            </div>
            <div>
              <p>{{ post.body }}</p>
            </div>
          </div>
        </div>
      </div>
      <h5 v-else>No comments found.</h5>
    </div>

    <div class="d-flex" v-if="isLoggedIn">
      <div class="borderBox createBox">
        <form @submit.prevent="createComment">
          <p class="text-center">Add comment</p>
          <div>
            <v-textarea variant="solo-filled" v-model="postForm.body"></v-textarea>
          </div>

          <div>
            <v-btn type="submit" color="#C62828" class="basicBtn">Save</v-btn>
          </div>
        </form>
      </div>

      <div class="borderBox createBox">
        <form @submit.prevent="createAlbum">
          <p class="text-center">Add album</p>
          <div>
            <v-text-field label="Album title" variant="solo-filled" v-model="albumForm.title" />
          </div>

          <div v-for="artist in band.artists" :key="artist.id">
            <v-checkbox
              hide-details
              density="compact"
              v-model="albumForm.albumArtists"
              :label="artist.name"
              :value="artist.id"
            ></v-checkbox>
          </div>

          <div>
            <v-btn type="submit" color="#C62828" class="basicBtn">Save</v-btn>
          </div>
        </form>
      </div>

      <div class="borderBox createBox">
        <form @submit.prevent="createArtist">
          <p class="text-center">Add artist</p>
          <div>
            <v-text-field label="Artist's name" variant="solo-filled" v-model="artistForm.name" />
          </div>

          <div>
            <v-date-input
              label="Date input"
              v-model="artistForm.birth"
              clearable
              @click:clear="artistForm.birth = null"
            ></v-date-input>
          </div>

          <div>
            <v-btn type="submit" color="#C62828" class="basicBtn">Save</v-btn>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
.commentBox {
  border: solid 1px black;
  margin: 5px;
  padding: 5px;
}
</style>
