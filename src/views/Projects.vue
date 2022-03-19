<template>
  <div class="min-h-screen pt-20 bg-img bg-img-cover">
    <div
      class="flex flex-col items-center justify-center max-w-screen-xl m-auto"
    >
      <div class="text-center">
        <h1 class="mb-7 header-main">Projects</h1>
        <p class="mb-7 drop-shadow-3xl">
          Some micro-apps I've made while messing around.
        </p>
      </div>
      <main class="grid grid-cols-2 p-20">
        <section
          v-for="project in projects"
          :key="project.route"
          class="px-10 py-5 menu-section"
        >
          <router-link class="m-2" :to="{ name: project.route }">
            <h2 class="text-4xl font-semibold underline drop-shadow-3xl">
              {{ project.name }}
            </h2>
            <p class="py-5 text-lg drop-shadow-3xl">{{ project.text }}</p>
          </router-link>
        </section>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { projectConfig } from '@/data/menuConfig'

const projects = ref(projectConfig)
</script>
<style lang="scss" scoped>
.bg-img {
  background-image: url('@/assets/images/backgrounds/hexagon.svg');
}
</style>
