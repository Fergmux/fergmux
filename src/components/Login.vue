<template>
  <div
    class="fixed top-0 bottom-0 left-0 right-0 flex flex-col items-center p-8 m-auto rounded-lg h-min w-min min-w-max bg-mint-400 drop-shadow-3xl"
  >
    <div
      class="absolute top-0 right-0 m-2 text-3xl cursor-pointer material-icons md-dark"
      @click="emit('hideLogin')"
    >
      close
    </div>

    <h2 class="mb-8 text-3xl font-bold drop-shadow-3xl">Login/Register</h2>

    <div class="w-full font-semibold"><h5>Username</h5></div>
    <input v-model="user.username" type="text" class="w-auto text-field" />

    <div class="w-full font-semibold"><h5>Password</h5></div>
    <input v-model="user.password" type="password" class="w-auto text-field" />

    <div class="flex justify-around w-full">
      <button class="m-5 button-light" @click="login">Login</button>
      <button class="m-5 button-light" @click="register">Register</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useUser } from '@/stores/user'
import api from '@/lib/api'

const user = ref({
  username: null,
  password: null,
})

const userStore = useUser()

const login = async () => {
  const response = await api.post('/.netlify/functions/login', user.value)
  userStore.setUser(response)
}

const register = async () => {
  const { username, id } = await api.post(
    '/.netlify/functions/create-user',
    user.value
  )
  const { secret } = await api.post('/.netlify/functions/login', user.value)
  debugger
  userStore.setUser({ secret, id })
}

const emit = defineEmits(['hideLogin'])
</script>
