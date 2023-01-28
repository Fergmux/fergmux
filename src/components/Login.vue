<template>
  <div class="flex flex-col items-start">
    <label class="my-2">
      Username:
      <input v-model="username" class="rounded bg-slate-700" type="text" />
    </label>
    <label class="my-2">
      Password:
      <input v-model="password" class="rounded bg-slate-700" type="password" />
    </label>

    <div class="my-5">
      <button class="mr-5 rounded bg-slate-500 p-2" @click="createUser">
        Create account
      </button>
      <button class="mr-5 rounded bg-slate-500 p-2" @click="login()">
        Login
      </button>
      <button class="mr-5 rounded bg-slate-500 p-2" @click="viewUser">
        View
      </button>
    </div>
    <span v-if="errorMessage" class="text-red-500">{{ errorMessage }}</span>
    <span v-if="userNotFound" class="max-w-[500px]">
      This user wasn't found, if you would like to create an account with this
      username please enter a password. Otherwise try again with a different
      username.
    </span>
    <br />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'
import { sha256 } from 'js-sha256'
import api from '@/lib/api'
import { userState, setUserData } from '@/store/lifeTrackerStore' // TODO: Make this dynamic when needed

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
