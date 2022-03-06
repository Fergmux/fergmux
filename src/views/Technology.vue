<template>
  <div class="bg-img bg-img-cover overflow-x-hidden">
    <section
      v-for="section in sections"
      :key="section.key"
      class="max-w-screen-xl m-auto"
    >
      <div class="w-full h-60 flex flex-col items-center justify-center">
        <h1 class="text-5xl mb-4 font-semibold">{{ section.title }}</h1>
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
            class="h-36 cursor-pointer flex items-center justify-between text-3xl font-bold text-mint-200 p-5 hover:scale-110 transition-transform hover:z-10 hover:drop-shadow-md"
          >
            <div
              class="logo img-contain drop-shadow-md"
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
import { ref } from 'vue'
import { techSections, technologies } from '@/data/technologies.js'
import hexRgb from 'hex-rgb'

export default {
  setup() {
    const sections = ref(techSections)
    const tech = ref(technologies)

    const lighten = (hex) => {
      const rgbColor = hexRgb(hex, { format: 'array', alpha: 1 })

      return `rgba(${rgbColor
        .map((c, index) => (index < 3 ? Math.round(c * 1.3) : c))
        .join(', ')})`
    }

    return { tech, sections, lighten }
  },
}
</script>

<style lang="scss" scoped>
.tech-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
.logo {
  width: 80px;
  height: 70%;
}
.bg-img {
  background-image: url('@/assets/images/backgrounds/shiny.svg');
}
</style>
