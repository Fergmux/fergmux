<template>
  <div class="app min-h-screen relative">
    <div class="fixed flex justify-between z-20 w-full">
      <router-link
        to="/"
        class="material-icons md-dark cursor-pointer m-2 text-lg"
      >
        home
      </router-link>
      <div
        @click="toggleDark"
        class="material-icons md-dark cursor-pointer m-2 text-lg"
      >
        {{ darkMode ? 'light_mode' : 'dark_mode' }}
      </div>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { provide, ref, onMounted } from 'vue'
import './index.css'

export default {
  setup() {
    const darkMode = ref(false)

    provide('dark', darkMode)

    const toggleDark = () => {
      darkMode.value = !darkMode.value
      document.querySelector('html').classList.toggle('dark')
      localStorage.setItem('darkMode', JSON.stringify(darkMode.value))
    }

    onMounted(() => {
      const localDark = JSON.parse(localStorage.getItem('darkMode'))
      const systemDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches

      if (localDark != null) {
        if (darkMode.value !== localDark) {
          toggleDark()
        }
      } else if (systemDark) {
        toggleDark()
      }
    })

    return { darkMode, toggleDark }
  },
}
</script>

<style>
.app {
  font-family: 'Inter', Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
