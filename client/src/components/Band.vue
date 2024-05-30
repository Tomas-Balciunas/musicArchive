<script lang="ts" setup>
import type { BandBare } from '@mono/server/src/shared/entities'

defineProps<{
  band: BandBare
}>()
</script>

<template>
  <div class="bandbox">
    <h5 class="ml-2 mr-5 text-2xl font-bold">
      {{ band.name }}
    </h5>
    <span>{{ band.description }}</span>
  </div>
</template>

<style>
.bandbox {
  display: flex;
  align-items: center;
  border: solid 1px black;
  padding: 5px;
  margin: 10px;
}
</style>
