<script setup lang="ts">
import { trpc } from '@/trpc'
import { onBeforeMount, ref, type Ref } from 'vue'
import type {
  BandFull,
  ArtistInsert,
  PostInsert,
} from '@mono/server/src/shared/entities'
import { useRoute, useRouter } from 'vue-router'
import { makeInsert, tryCatch } from '@/composables'
import { isLoggedIn } from '@/stores/user'

const band = ref<BandFull>()
const route = useRoute()
const router = useRouter()
const bandId = Number(route.params.id)

const artistForm = ref({
  name: '',
  birth: null,
})

const postForm = ref({
  body: '',
})

const postInsert: Ref<PostInsert> = makeInsert(postForm.value, { bandId })
const artistInsert: Ref<ArtistInsert> = makeInsert(artistForm.value, { bandId })

const createArtist = () => {
  tryCatch(async () => {
    await trpc.request.create.add.mutate({entity: 'ARTIST', info: 'testartist',  ...artistInsert.value})
    
  })
}

const createComment = () => {
  tryCatch(async () => {
    await trpc.post.create.mutate(postInsert.value)
    await updateBand()
  })
}

const approveBand = async () => {
  if (band.value) {
    await trpc.band.status.mutate({ id: band.value.id, pending: false })
    router.push({ name: 'Requests' })
  }
}

const updateBand = async () => {
  band.value = await trpc.band.get.query(bandId)
}

onBeforeMount(async () => {
  await updateBand()
})
</script>

<template>
  <div v-if="band">
    <v-btn
      ><RouterLink :to="{ name: 'BandUpdate', params: { id: bandId } }">Update</RouterLink></v-btn
    >
    <v-btn v-if="band.pending" @click.prevent="approveBand">Approve</v-btn>
    <div class="borderBox">
      <h1>{{ band.name }}</h1>
      <h5>Formed in: {{ band.formed ?? 'N/A' }}</h5>
      <h5>Originated in: {{ band.origin ?? 'N/A' }}</h5>
      <p>{{ band.description }}</p>
    </div>

    <div v-if="!band.pending">
      <div v-if="band.artists.length" class="borderBox">
        <h3>Artists</h3>
        <div v-for="artist in band.artists" :key="artist.id">
          <RouterLink :to="{ name: 'Artist', params: { id: artist.id } }">
            <p>{{ artist.name }}</p>
          </RouterLink>
        </div>
      </div>
      <h5 v-else>No artists found.</h5>
    </div>

    <div v-if="!band.pending" class="borderBox">
      <div v-if="band.albums.length">
        <h3>Albums</h3>
        <div v-for="album in band.albums" :key="album.id">
          <RouterLink :to="{ name: 'Album', params: { id: album.id } }"
            ><p>{{ album.title }}</p></RouterLink
          >
        </div>
      </div>
      <h5 v-else>No albums found.</h5>
      <v-btn><RouterLink :to="{name: 'AlbumCreate', params: {id: bandId}}">Add album</RouterLink></v-btn>
    </div>

    <div v-if="!band.pending" class="borderBox">
      <div v-if="band.posts.length">
        <h3>Comments</h3>
        <div v-for="post in band.posts" :key="post.id">
          <div class="commentBox">
            <div>
              <span
                >{{ post.user.username }}
                {{ String(post.createdAt).slice(0, 19).replace('T', ' ') }}</span
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

    <div v-if="!band.pending && isLoggedIn" class="d-flex">
      <div class="borderBox createBox">
        <form @submit.prevent="createComment">
          <p class="text-center">Add user comment</p>
          <div>
            <v-textarea variant="solo-filled" v-model="postForm.body"></v-textarea>
          </div>

          <div>
            <v-btn type="submit" color="#C62828" class="basicBtn">Save</v-btn>
          </div>
        </form>
      </div>

      <div class="borderBox createBox">
        <form @submit.prevent="createArtist">
          <p class="text-center">Create artist</p>
          <div>
            <v-text-field label="Name" variant="solo-filled" v-model="artistForm.name" />
          </div>

          <div>
            <v-date-input
              label="Birth date (optional)"
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
