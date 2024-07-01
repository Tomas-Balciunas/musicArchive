<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { tryCatch } from '@/composables'

const router = useRouter()
const userStore = useUserStore()

const userForm = ref({
  email: '',
  password: '',
})

const submitLogin = () => {
  tryCatch(async () => {
    await userStore.login(userForm.value)

    router.push({ name: 'Home' })
  })
}
</script>

<template>
  <v-text-field type="email" v-model="userForm.email" placeholder="Email"/>

  <v-text-field
    type="password"
    v-model="userForm.password"
    :required="true"
    placeholder="Password"
  />

  <div class="grid">
    <v-btn color="#00897B" type="submit" @click.prevent="submitLogin">Log In</v-btn>
  </div>

  <div>
    Not a member?
    {{ ' ' }}
    <RouterLink :to="{ name: 'Signup' }">Sign up</RouterLink>
  </div>
</template>
