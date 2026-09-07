<template>
  <div class="bg-img bg-img-cover min-h-screen px-5 py-20">
    <div class="m-auto flex max-w-screen-xl flex-col items-center">
      <div class="max-w-2xl text-center">
        <h1 class="header-main mb-5">Projects</h1>
        <p class="text-lg leading-8 text-white drop-shadow-3xl">
          Some projects I've made in my spare time.
        </p>
      </div>

      <main
        class="mt-12 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <section
          v-for="project in projects"
          :key="project.route"
          class="project-card group"
        >
          <a
            v-if="project.href"
            :href="project.href"
            target="_blank"
            rel="noopener noreferrer"
            class="project-link"
          >
            <span class="project-card-title">
              {{ project.name }}
              <span
                class="material-icons-outlined text-2xl transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              >
                open_in_new
              </span>
            </span>
            <span class="project-card-text">{{ project.text }}</span>
          </a>

          <router-link v-else class="project-link" :to="{ name: project.route }">
            <span class="project-card-title">
              {{ project.name }}
              <span
                class="material-icons-outlined text-2xl transition-transform group-hover:translate-x-1"
              >
                arrow_forward
              </span>
            </span>
            <span class="project-card-text">{{ project.text }}</span>
          </router-link>
        </section>
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { projectConfig } from '@/data/menuConfig'

const projects = computed(() => [...projectConfig].reverse())
</script>
<style lang="scss" scoped>
.bg-img {
  background-image: url('@/assets/images/backgrounds/hexagon.svg');
}

.project-card {
  @apply min-h-52 rounded-md border border-mint-600 bg-mint-200/95 shadow-out transition duration-200 hover:-translate-y-1 hover:border-mint-800 hover:bg-mint-300 hover:shadow-lg;
}

.project-link {
  @apply flex h-full flex-col justify-between gap-8 p-6 text-left text-mint-900;
}

.project-card-title {
  @apply flex items-start justify-between gap-4 text-3xl font-semibold leading-tight text-white;
}

.project-card-text {
  @apply text-base leading-7 text-mint-900;
}
</style>
