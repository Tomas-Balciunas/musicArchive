<script lang="ts" setup>
import BandUpdateList from '@/components/requests/BandUpdateList.vue'
import BandPendingList from '@/components/requests/BandPendingList.vue'
import AlbumCreateList from '@/components/requests/AlbumCreateList.vue';
</script>

<template>
  Updates:
  <BandUpdateList></BandUpdateList>
  Pending bands:
  <BandPendingList></BandPendingList>
  Pending album creates:
<AlbumCreateList></AlbumCreateList>
</template>
