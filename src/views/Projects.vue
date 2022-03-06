<template>
  <div class="pt-20 bg-img bg-img-cover min-h-screen">
    <div
      class="max-w-screen-xl flex flex-col items-center justify-center m-auto"
    >
      <div class="text-center">
        <h1 class="text-6xl mb-7 underline font-semibold">Projects</h1>
        <p class="mb-7">Some micro-apps I've made while messing around.</p>
      </div>
      <main class="grid p-20 grid-cols-2">
        <section
          v-for="project in projects"
          :key="project.route"
          class="py-5 px-10 menu-section"
        >
          <router-link class="m-2" :to="{ name: project.route }">
            <h2 class="text-4xl underline font-semibold">{{ project.name }}</h2>
            <p class="py-8">{{ project.text }}</p>
          </router-link>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { projectConfig } from '@/data/menuConfig'

export default {
  setup() {
    const projects = ref(projectConfig)

    return { projects }
  },
}
</script>
<style lang="scss" scoped>
.bg-img {
  background-image: url('@/assets/images/backgrounds/hexagon.svg');
}
</style>
