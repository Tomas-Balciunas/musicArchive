<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import type { BandBare } from '@mono/server/src/shared/entities'
import Band from '@/components/Band.vue'
import { trpc } from '@/trpc'
import { isLoggedIn } from '@/stores/user'

const bands = ref<BandBare[]>([])

onBeforeMount(async () => {
  bands.value = await trpc.band.find.query()
})
</script>

<template>
  <div>
    <h3>Bands:</h3>
    <div v-if="bands.length">
      <RouterLink
        v-for="band in bands"
        :key="band.id"
        :to="{ name: 'Band', params: { id: band.id } }"
        ><Band :band="band"
      /></RouterLink>
    </div>
    <h5 v-else>No bands found.</h5>

    <div v-if="isLoggedIn">
      <RouterLink component="RouterLink" :to="{ name: 'BandCreate' }"
        ><v-btn color="#C62828">Add a new band</v-btn></RouterLink
      >
    </div>
  </div>
</template>
