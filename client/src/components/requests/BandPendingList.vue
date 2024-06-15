<script lang="ts" setup>
import { trpc } from '@/trpc'
import { onBeforeMount, ref } from 'vue'
import { RouterLink } from 'vue-router'

const bands = ref()

onBeforeMount(async () => {
  bands.value = await trpc.band.findPending.query()
})
</script>

<template>
  <div v-if="bands">
    <div v-for="b in bands" :key="b.id">
      <RouterLink :to="{ name: 'Band', params: { id: b.id } }">
        <v-card hover class="bandList">
          <v-card-item>
            <v-card-title>
              <span>{{ b.name }}</span>
            </v-card-title>
            <v-card-subtitle>
              {{ b.createdAt }}
            </v-card-subtitle>
          </v-card-item>
        </v-card>
      </RouterLink>
    </div>
  </div>
</template>
