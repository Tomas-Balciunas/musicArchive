<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useNotifStore } from '@/stores/notif'
import { SIGNUP_SUCCESS } from '@/consts'
import { useRouter } from 'vue-router'
import { tryCatch } from '@/composables'

const userForm = ref({
  username: '',
  email: '',
  password: '',
})

const router = useRouter()
const notifStore = useNotifStore()
const userStore = useUserStore()

async function submitSignup() {
  tryCatch(async () => {
    await userStore.signup(userForm.value)
    notifStore.showNotif(SIGNUP_SUCCESS)
    router.push({ name: 'Login' })
  })
}
</script>

<template>
  <form @submit.prevent="submitSignup">
    <v-text-field type="text" placeholder="username" v-model="userForm.username" />
    <v-text-field type="email" placeholder="email" v-model="userForm.email" />

    <v-text-field
      type="password"
      placeholder="password"
      variant="solo-filled"
      v-model="userForm.password"
    />

    <div class="grid">
      <v-btn color="#00897B" type="submit">Sign Up</v-btn>
    </div>

    Already a member?
    {{ ' ' }}
    <RouterLink :to="{ name: 'Login' }">Log in</RouterLink>
  </form>
</template>
