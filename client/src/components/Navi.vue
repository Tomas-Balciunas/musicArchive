<script lang="ts" setup>
import router from '@/router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

function logoutUser() {
  userStore.logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <v-app-bar scroll-behavior="hide" :elevation="2">
    <template v-slot:prepend>
      <v-app-bar-nav-icon>
        <v-btn :to="{ name: 'Home' }" :active="false" icon>
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </v-app-bar-nav-icon>
    </template>

    <v-app-bar-title> Welcome to the Music Archive </v-app-bar-title>

    <v-btn v-if="userStore.isLoggedIn" @click.prevent="logoutUser" icon>
      <v-icon>mdi-logout</v-icon>
    </v-btn>

    <div v-else>
      <v-btn :to="{ name: 'Login' }" icon>
        <v-icon>mdi-login</v-icon>
      </v-btn>

      <v-btn :to="{ name: 'Signup' }" icon>
        <v-icon>mdi-file-sign</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
  <v-navigation-drawer expand-on-hover rail>
    <v-list>
      <v-list-item
        prepend-avatar="https://icons.veryicon.com/png/o/internet--web/three-body-project-icon/user-126.png"
        :title="userStore.userIdentifier?.username ?? 'Guest'"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        :to="{ name: 'BandCreate' }"
        prepend-icon="mdi-folder-plus"
        title="Create a band"
        :active="false"
      ></v-list-item>
      <v-list-item
        :to="{ name: 'ArtistCreate' }"
        prepend-icon="mdi-folder-plus"
        title="Create an artist"
        :active="false"
      ></v-list-item>
      <v-list-item
        :to="{ name: 'Requests' }"
        prepend-icon="mdi-queue-first-in-last-out"
        title="Requests"
        :active="false"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-main style="height: 250px"></v-main>
</template>

<style></style>
