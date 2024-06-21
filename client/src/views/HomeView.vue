<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import type { BandBare } from '@mono/server/src/shared/entities'
import { trpc } from '@/trpc'
import { isLoggedIn } from '@/stores/user'

const bands = ref<BandBare[]>([])

onBeforeMount(async () => {
  bands.value = await trpc.band.find.query()
})
</script>

<template>
  <div>
    <div v-if="isLoggedIn">
      <RouterLink :to="{ name: 'BandCreate' }"
        ><v-btn color="#C62828">Create a new band</v-btn></RouterLink
      >
    </div>
    <div v-if="isLoggedIn">
      <RouterLink :to="{ name: 'ArtistCreate' }"
        ><v-btn color="#C62828">Create a new artist</v-btn></RouterLink
      >
    </div>
    <h3>Bands:</h3>
    <div v-if="bands.length">
      <RouterLink
        v-for="b in bands"
        :key="b.id"
        :to="{ name: 'Band', params: { id: b.id } }"
        ><v-card hover class="bandList" color="indigo-darken-3">
          <v-card-item>
            <v-card-title>
              <span>{{ b.name }}</span>
            </v-card-title>

            <v-card-subtitle>
              {{ b.description }}
            </v-card-subtitle>
          </v-card-item>
        </v-card></RouterLink>
    </div>
    <h5 v-else>No bands found.</h5>
  </div>
</template>
