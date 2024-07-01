<script lang="ts" setup>
import BandUpdateList from '@/components/requests/lists/BandUpdateList.vue'
import BandPendingList from '@/components/requests/lists/BandPendingList.vue'
import AlbumCreateList from '@/components/requests/lists/AlbumCreateList.vue'
import ArtistCreateList from '@/components/requests/lists/ArtistCreateList.vue'
import AlbumUpdateList from '@/components/requests/lists/AlbumUpdateList.vue'
import ArtistUpdateList from '@/components/requests/lists/ArtistUpdateList.vue'
import { ref } from 'vue'

const tab = ref('')
const updates = ref('')
const creates = ref('')
</script>

<template>
  <v-tabs v-model="tab" bg-color="primary" align-tabs="center">
    <v-tab value="create">create requests</v-tab>
    <v-tab value="update">update requests</v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="create">
      <v-tabs v-model="creates" bg-color="primary" align-tabs="center">
        <v-tab value="band">Bands</v-tab>
        <v-tab value="album">Albums</v-tab>
        <v-tab value="artist">Artists</v-tab>
      </v-tabs>

      <v-tabs-window v-model="creates">
        <v-tabs-window-item value="band"><BandPendingList></BandPendingList></v-tabs-window-item>

        <v-tabs-window-item value="album">
          <AlbumCreateList></AlbumCreateList>
        </v-tabs-window-item>
        <v-tabs-window-item value="artist"
          ><ArtistCreateList></ArtistCreateList
        ></v-tabs-window-item>
      </v-tabs-window>
    </v-tabs-window-item>

    <v-tabs-window-item value="update">
      <v-tabs v-model="updates" bg-color="primary" align-tabs="center">
        <v-tab value="band">Bands</v-tab>
        <v-tab value="album">Albums</v-tab>
        <v-tab value="artist">Artists</v-tab>
      </v-tabs>

      <v-tabs-window v-model="updates">
        <v-tabs-window-item value="band"><BandUpdateList></BandUpdateList></v-tabs-window-item>

        <v-tabs-window-item value="album">
          <AlbumUpdateList></AlbumUpdateList>
        </v-tabs-window-item>
        <v-tabs-window-item value="artist"
          ><ArtistUpdateList></ArtistUpdateList
        ></v-tabs-window-item>
      </v-tabs-window>
    </v-tabs-window-item>
  </v-tabs-window>
</template>
