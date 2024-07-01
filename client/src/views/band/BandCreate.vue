<script setup lang="ts">
import { trpc } from '@/trpc'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { tryCatch } from '@/composables'
import type { BandInsert } from '@mono/server/src/shared/entities'
import { getCountryDataList } from 'countries-list'
import { onBeforeMount } from 'vue'

const router = useRouter()
const countryList = ref<string[]>([])
const bandForm = ref<BandInsert>({
  name: '',
  description: '',
  formed: null,
  origin: '',
})

const createBand = () => {
  tryCatch(async () => {
    await trpc.band.create.mutate(bandForm.value)

    router.push({ name: 'Home' })
  })
}

onBeforeMount(() => {
  countryList.value = getCountryDataList().map((c) => c.name)
})
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
        <div class="mt-6">
          <v-number-input
            type="number"
            v-model="bandForm.formed"
            variant="solo-filled"
            placeholder="Year formed in"
          />
        </div>
        <div class="mt-6">
          <v-select
            clearable
            v-model="bandForm.origin"
            :items="countryList"
            variant="solo-filled"
            label="Country of origin"
          ></v-select>
        </div>
      </div>

      <div>
        <v-btn type="submit" color="#00897B">Save</v-btn>
      </div>
    </form>
  </div>
</template>
