<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue'
import type { BandMinimal } from '@mono/server/src/shared/entities'
import { trpc } from '@/trpc'

const bands = ref<BandMinimal[]>([])

onBeforeMount(async () => {
  bands.value = await trpc.band.find.query()
})

</script>

<template>
  <div>
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
          </v-card-item>
        </v-card></RouterLink>
    </div>
    <h5 v-else>No bands found.</h5>
  </div>
</template>
