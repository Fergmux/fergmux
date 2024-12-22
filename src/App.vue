<template>
  <div class="app relative min-h-screen">
    <div class="fixed z-10 flex w-full justify-between">
      <router-link
        to="/"
        class="material-icons m-2 mx-3 cursor-pointer text-2xl"
      >
        home
      </router-link>
      <div
        class="material-icons m-2 mx-3 cursor-pointer text-3xl"
        @click="showMenu = true"
      >
        menu
      </div>
    </div>

    <router-view></router-view>

    <Menubar v-model="showMenu"></Menubar>
  </div>
</template>

<script lang="ts" setup>
import Menubar from '@/components/Menubar.vue'
import { ref } from 'vue'
import './index.css'

const showMenu = ref(false)
</script>

<style lang="scss">
.app {
  font-family: 'Inter', Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
