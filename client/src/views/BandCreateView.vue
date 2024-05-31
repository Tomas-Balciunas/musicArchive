<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { tryCatch } from '@/composables'

const router = useRouter()

const bandForm = ref({
  name: '',
  description: '',
})

const createBand = () => {
  tryCatch(async () => {
    await trpc.band.create.mutate(bandForm.value)

    router.push({ name: 'Home' })
  })
}
</script>

<template>
  <div>
    <form @submit.prevent="createBand">
      <div>
        <h4>Create a new band</h4>

        <div class="mt-6">
          <v-text-field
            type="text"
            v-model="bandForm.name"
            variant="solo-filled"
            placeholder="Band name"
          />
        </div>
        <div class="mt-6">
          <v-text-field
            type="text"
            v-model="bandForm.description"
            variant="solo-filled"
            placeholder="Band description"
          />
        </div>
      </div>

      <div>
        <v-btn type="submit" color="#00897B">Save</v-btn>
      </div>
    </form>
  </div>
</template>
