<script lang="ts" setup>
import BandUpdateList from '@/components/requests/BandUpdateList.vue'
import BandPendingList from '@/components/requests/BandPendingList.vue'
import AlbumCreateList from '@/components/requests/AlbumCreateList.vue';
import ArtistCreateList from '@/components/requests/ArtistCreateList.vue';
import AlbumUpdateList from '@/components/requests/AlbumUpdateList.vue';
import ArtistUpdateList from '@/components/requests/ArtistUpdateList.vue';
</script>

<template>
  Album updates:
<AlbumUpdateList></AlbumUpdateList>
  Band updates:
  <BandUpdateList></BandUpdateList>
  Artist updates:
<ArtistUpdateList></ArtistUpdateList>
  Pending new bands:
  <BandPendingList></BandPendingList>
  Pending new albums:
<AlbumCreateList></AlbumCreateList>
Pending new artists:
<ArtistCreateList></ArtistCreateList>
</template>
