<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { tryCatch } from '@/composables'
import type { ArtistInsert } from '@mono/server/src/shared/entities'

const router = useRouter()

const info = ref('')
const artistForm = ref<ArtistInsert>({
  name: '',
  birth: null
})

const createArtist = () => {
  tryCatch(async () => {
    await trpc.artist.create.mutate(artistForm.value)

    router.push({ name: 'Home' })
  })
}

const submitArtist = () => {
  tryCatch(async () => {
    await trpc.request.create.add.mutate({entity: 'ARTIST', info: info.value, ...artistForm.value})

    router.push({ name: 'Home' })
  })
}
</script>

<template>
  <div>
    <form @submit.prevent="createArtist">
      <div>
        <h4>Create a new artist</h4>

        <div class="mt-6">
          <v-text-field
            type="text"
            v-model="artistForm.name"
            variant="solo-filled"
            placeholder="Artist name"
          />
        </div>
        <div>
            <v-date-input
              label="Birth date (optional)"
              v-model="artistForm.birth"
              clearable
              @click:clear="artistForm.birth = null"
            ></v-date-input>
          </div>
          <v-textarea
      v-model="info"
      label="Provide source(s) and/or clarification for the changes."
      variant="solo-filled"
    ></v-textarea>
      </div>

      <div>
        <v-btn @click.prevent="createArtist" type="submit" color="#00897B">Create</v-btn>
      </div>
      <div>
        <v-btn @click.prevent="submitArtist" type="submit" color="#00897B">Submit</v-btn>
      </div>
    </form>
  </div>
</template>
