<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { tryCatch } from '@/composables'

const artist = ref()
const route = useRoute()
const artistId = Number(route.params.id)

const info = ref('')

function submitChanges() {
  if (artist.value) {
    trpc.artist.update.mutate({ id: artistId, ...artist.value })
  }
}

function submitRequest() {
  if (artist.value) {
    tryCatch(async () => {
      await trpc.request.update.add.mutate({
        ...artist.value,
        entity: 'ARTIST',
        entityId: artistId,
        info: info.value,
      })
    })
  }
}

onBeforeMount(async () => {
  const data = await trpc.artist.get.query(artistId)
  artist.value = data
})
</script>

<template>
  <div v-if="artist">
    <v-text-field v-model="artist.name"></v-text-field>
    <div>
      <v-date-input
        label="Birth date (optional)"
        v-model="artist.birth"
        clearable
        @click:clear="artist.birth = null"
      ></v-date-input>
    </div>
    <v-textarea
      v-model="info"
      label="Provide source(s) and/or clarification for the changes."
      variant="solo-filled"
    ></v-textarea>

    <v-btn @click.prevent="submitChanges()">Update</v-btn>
    <v-btn @click.prevent="submitRequest()">Submit</v-btn>
  </div>
</template>
