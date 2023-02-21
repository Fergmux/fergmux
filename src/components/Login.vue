<template>
  <div class="flex flex-col items-center py-5 text-slate-600">
    <div class="signika mb-2 text-2xl font-semibold">Username</div>
    <input
      v-model="username"
      class="w-56 rounded-lg border-2 border-slate-300 bg-transparent p-2 font-semibold"
      type="text"
      @keyup.enter="password ? login() : viewUser()"
    />
    <div class="signika mb-2 mt-5 text-2xl font-semibold">Password</div>
    <input
      v-model="password"
      class="mb-5 w-56 rounded-lg border-2 border-slate-300 bg-transparent p-2"
      type="password"
      @keyup.enter="password ? login() : viewUser()"
    />

    <span v-if="errorMessage" class="w-56 text-red-500">
      {{ errorMessage }}
    </span>
    <span v-if="userNotFound" class="w-56">
      This user wasn't found, if you would like to create an account with this
      username please {{ password ? '' : 'enter a password and ' }}click 'Create
      account'.
    </span>

    <button
      class="mt-5 w-56 rounded-lg p-2 text-slate-100"
      :style="{ 'background-color': shade(gradient[0], 0.9) }"
      @click="password ? login() : viewUser()"
    >
      {{ password ? 'Login' : 'View' }}
    </button>
    <button
      class="mt-5 w-56 rounded-lg p-2 text-slate-100"
      :style="{ 'background-color': shade(gradient[1], 0.9) }"
      @click="createUser"
    >
      Create account
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'
import { sha256 } from 'js-sha256'
import api from '@/lib/api'
import { shade } from '@/lib/utils'
import { userState, gradient, setUserData } from '@/store/lifeTrackerStore' // TODO: Make this dynamic when needed

const usernameRegex = /^[a-zA-Z0-9]{3,32}$/
const passwordRegex = /^.{1,128}$/

const errorMessages = {
  username:
    'Username must be between 3 and 32 characters long and only contain letters and numbers.',
  password: 'Password must be at least 8 characters long.',
}

const username: Ref<string | undefined> = ref(userState.userData?.username)
const password: Ref<string> = ref('')
const userNotFound: Ref<boolean> = ref(false)
const errorMessage: Ref<string | undefined> = ref(undefined)

onMounted(() => {
  const username = localStorage.getItem('username')
  const password = localStorage.getItem('password')
  if (username && password) {
    userState.showLoading = true
    login(username, password)
  }
})

const getUser = async (
  user: string | undefined = undefined
): Promise<boolean> => {
  if (username.value && !usernameRegex.test(username.value)) {
    errorMessage.value = errorMessages.username
    return false
  }

  errorMessage.value = undefined

  const result = await api.post('/.netlify/functions/get-user', {
    username: user ?? username.value,
  })

  if (result.username) {
    setUserData(result)
    userState.userAuthorised = false
    userNotFound.value = false
    return true
  } else if (result.statusCode === 404) {
    userNotFound.value = true
  }
  return false
}

const login = async (
  user: string | undefined = undefined,
  pass: string | undefined = undefined
) => {
  const userFound = await getUser(user)

  if (!userFound || !userState.userData) {
    return
  }

  if (userState.userData?.password === (pass ?? sha256(password.value))) {
    userState.userAuthorised = true
    errorMessage.value = undefined
    userState.showLogin = false
    localStorage.setItem('username', userState.userData.username)
    localStorage.setItem('password', userState.userData.password)
  } else {
    errorMessage.value = 'Incorrect password'
  }
  userState.showLoading = false
}

const viewUser = async () => {
  const userFound = await getUser()

  if (!userFound) {
    return
  }

  userState.showLogin = false
}

const createUser = async (): Promise<void> => {
  if (!username.value || !usernameRegex.test(username.value)) {
    errorMessage.value = errorMessages.username
    return
  }

  const userFound = await getUser()

  if (userFound) {
    errorMessage.value = 'This user already exists'
    return
  }

  userNotFound.value = false

  if (!passwordRegex.test(password.value)) {
    errorMessage.value = errorMessages.password
    return
  }

  errorMessage.value = undefined

  const result = await api.post('/.netlify/functions/create-user', {
    username: username.value,
    password: sha256(password.value),
  })

  if (result.username) {
    setUserData(result)
    userNotFound.value = false
    userState.userAuthorised = true
    localStorage.setItem('username', result.username)
    localStorage.setItem('password', result.password)
    userState.showLogin = false
  } else {
    throw new Error(result)
  }
}
</script>
