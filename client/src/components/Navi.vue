<script lang="ts" setup>
import router from '@/router'
import { authUserId, isLoggedIn } from '@/stores/user'
import { logout } from '@/stores/user'

const user = authUserId
function logoutUser() {
  logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="navbox">
    <div v-if="!isLoggedIn">
      <RouterLink :to="{ name: 'Login' }"><v-btn color="#00897B">Login</v-btn></RouterLink>
      <RouterLink :to="{ name: 'Signup' }"><v-btn color="#00897B">Sign Up</v-btn></RouterLink>
      <RouterLink :to="{ name: 'Home' }"><v-btn color="#00897B">Home</v-btn></RouterLink>
    </div>
    <div v-else>
      <span>User id: {{ user }}</span>
      <v-btn color="#C62828" @click.prevent="logoutUser">Log out</v-btn>
      <RouterLink :to="{ name: 'Home' }"><v-btn color="#00897B">Home</v-btn></RouterLink>
    </div>
  </div>
</template>

<style>
.navbox {
  padding: 10px;
  border-bottom: 2px solid black;
  margin-bottom: 20px;
}
</style>
