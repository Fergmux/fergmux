<template>
  <div class="-mt-10">
    <section v-for="section in sections" :key="section.key">
      <div
        class="w-full h-60 flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-800"
      >
        <h1 class="text-5xl mb-4">{{ section.title }}</h1>
        <p>{{ section.subtitle }}</p>
      </div>
      <div class="grid grid-flow-row col-auto tech-grid">
        <a
          v-for="tech in tech[section.key]"
          :key="tech.id"
          :href="tech.link"
          target="_blank"
        >
          <div
            :style="{ backgroundColor: lighten(tech.color) }"
            class="inline-block h-36 cursor-pointer flex items-center justify-between text-3xl font-bold text-slate-900 p-5 hover:scale-110 transition-transform hover:z-10 hover:drop-shadow-md"
          >
            <div
              class="logo drop-shadow-md"
              :style="{
                backgroundImage: `url(${tech.logo})`,
              }"
            />
            <span class="mx-3">{{ tech.name }}</span>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, inject } from 'vue'
import { techSections, technologies } from '@/data/technologies.js'
import hexRgb from 'hex-rgb'

export default {
  setup() {
    const dark = inject('dark', false)

    const sections = ref(techSections)
    const tech = ref(technologies)

    const lighten = (hex) => {
      const rgbColor = hexRgb(hex, { format: 'array', alpha: 1 })
      const total = rgbColor.reduce((total, val) => total + val, 0)
      const weight = !dark.value || total < 200 ? 1.6 : 0.7
      // const weight = !dark.value || total < 200 ? 30 : -30

      return `rgba(${rgbColor
        .map((c, index) => (index < 3 ? Math.round(c * weight) : c))
        .join(', ')})`
    }

    return { tech, sections, lighten }
  },
}
</script>

<style lang="scss">
.tech-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
.logo {
  width: 80px;
  height: 70%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
