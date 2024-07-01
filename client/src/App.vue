<script setup lang="ts">
import { RouterView } from 'vue-router'
import NotifComponent from '@/components/NotifComponent.vue'
import Navi from './components/Navi.vue'
</script>

<template>
  <v-app>
    <v-container>
    <Navi />
    <RouterView />
    <NotifComponent />
  </v-container>
  </v-app>
</template>
