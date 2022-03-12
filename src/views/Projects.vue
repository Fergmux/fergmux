<template>
  <div class="pt-20 bg-img bg-img-cover min-h-screen">
    <div
      class="max-w-screen-xl flex flex-col items-center justify-center m-auto"
    >
      <div class="text-center">
        <h1 class="mb-7 header-main">Projects</h1>
        <p class="mb-7 drop-shadow-3xl">
          Some micro-apps I've made while messing around.
        </p>
      </div>
      <main class="grid p-20 grid-cols-2">
        <section
          v-for="project in projects"
          :key="project.route"
          class="py-5 px-10 menu-section"
        >
          <router-link class="m-2" :to="{ name: project.route }">
            <h2 class="text-4xl font-semibold drop-shadow-3xl underline">
              {{ project.name }}
            </h2>
            <p class="py-5 text-lg drop-shadow-3xl">{{ project.text }}</p>
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
