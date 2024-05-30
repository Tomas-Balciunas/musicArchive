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

    router.push({ name: 'Dashboard' })
  })
}
</script>

<template>
  <div class="flex items-center justify-between">
    <form aria-label="Project" @submit.prevent="createBand">
      <div class="space-y-6">
        <h4>Create a new band</h4>

        <div class="mt-6">
          <input type="text" v-model="bandForm.name" placeholder="Band name" />
        </div>
        <div class="mt-6">
          <input type="text" v-model="bandForm.description" placeholder="Band description" />
        </div>
      </div>

      <div class="mt-6 grid grid-cols-2 items-center gap-3">
        <button type="submit" class="bg-green m-4 p-2">Save</button>
        <RouterLink
          class="text-center text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          component="RouterLink"
          :to="{ name: 'Dashboard' }"
          >Cancel</RouterLink
        >
      </div>
    </form>
  </div>
</template>
