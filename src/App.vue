<template>
  <div class="min-h-screen relative">
    <router-link
      to="/"
      class="material-icons absolute md-dark cursor-pointer m-2 text-lg left-0 z-10"
    >
      home
    </router-link>
    <div
      @click="toggleDark"
      class="material-icons absolute md-dark cursor-pointer m-2 text-lg right-0 z-10"
    >
      {{ darkMode ? 'light_mode' : 'dark_mode' }}
    </div>
    <div class="pt-10">
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
