<template>
  <div class="min-h-screen relative">
    <router-link to="/" class="material-icons md-dark cursor-pointer m-2 text-lg float-left"> home </router-link>
    <div @click="toggleDark" class="material-icons md-dark cursor-pointer m-2 text-lg float-right">
      {{ darkMode ? 'light_mode' : 'dark_mode' }}
    </div>

    <router-view class="pt-10"></router-view>

    <div class="absolute bottom-0 flex justify-center w-full items-center my-4">
      <a class="mx-3" href="https://github.com/Fergmux">
        <img :src="githubImage" alt="GitHub" />
      </a>

      <a class="mx-3" href="https://www.linkedin.com/in/fergusmull/">
        <img src="@/assets/linkedin.svg" alt="LinkedIn" />
      </a>

      <form class="mx-3" action="https://www.paypal.com/donate" method="post" target="_top">
        <input type="hidden" name="hosted_button_id" value="XCT76DGPUL6AN" />
        <button
          type="submit"
          name="submit"
          title="PayPal - The safer, easier way to pay online!"
          alt="Donate with PayPal button"
        >
          <img src="@/assets/paypal.svg" />
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { computed, provide, ref, onMounted } from 'vue'
import './index.css'
import githubBlack from '@/assets/github.svg'
import githubWhite from '@/assets/github-dark.svg'

export default {
  setup() {
    const darkMode = ref(false)
    const githubImage = computed(() => (darkMode.value ? githubWhite : githubBlack))

    provide('dark', darkMode)

    const toggleDark = () => {
      darkMode.value = !darkMode.value
      document.querySelector('html').classList.toggle('dark')
      localStorage.setItem('darkMode', JSON.stringify(darkMode.value))
    }

    onMounted(() => {
      const localDark = JSON.parse(localStorage.getItem('darkMode'))
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches

      if (localDark != null) {
        if (darkMode.value !== localDark) {
          toggleDark()
        }
      } else if (systemDark) {
        toggleDark()
      }
    })

    return { githubImage, darkMode, toggleDark }
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
