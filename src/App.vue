<template>
  <div class="relative min-h-screen app">
    <div class="fixed z-10 flex justify-between w-full">
      <router-link
        to="/"
        class="m-2 mx-3 text-2xl cursor-pointer material-icons"
      >
        home
      </router-link>
      <div
        class="m-2 mx-3 text-3xl cursor-pointer material-icons"
        @click="showMenu = true"
      >
        menu
      </div>
    </div>

    <router-view></router-view>

    <Menubar v-model="showMenu" @login="showLogin = true"></Menubar>

    <Login v-if="showLogin" @hide-login="showLogin = false"></Login>
  </div>
</template>

<script lang="ts" setup>
import './index.css'
import { ref } from 'vue'
import Menubar from '@/components/Menubar.vue'
import Login from './components/Login.vue'

const showMenu = ref(false)
const showLogin = ref(false)
</script>

<style lang="scss">
.app {
  font-family: 'Inter', Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
