<script setup lang="ts">
import { RouterView } from 'vue-router'
import NotifComponent from '@/components/NotifComponent.vue'
import Navi from './components/Navi.vue';
</script>

<template>
  <Navi />
  <RouterView />
  <NotifComponent />
</template>
