<template>
  <div class="overflow-x-hidden bg-img bg-img-cover">
    <div class="py-20">
      <div class="mt-10 mb-20 text-center">
        <h1 class="mb-4 header-main">Technologies</h1>
        <p class="mb-7 drop-shadow-3xl">
          A list of technologies and tools that I use, or have used.
        </p>
      </div>

      <section
        v-for="section in sections"
        :key="section.key"
        class="max-w-screen-xl m-auto"
      >
        <div class="flex flex-col items-center justify-center w-full h-60">
          <h1 class="mb-4 text-5xl font-semibold drop-shadow-3xl">
            {{ section.title }}
          </h1>
          <p class="drop-shadow-3xl">{{ section.subtitle }}</p>
        </div>
        <div class="grid grid-flow-row col-auto tech-grid">
          <a
            v-for="tech in techs[section.key]"
            :key="tech.id"
            :href="tech.link"
            target="_blank"
          >
            <div
              :style="{ backgroundColor: lighten(tech.color) }"
              class="flex items-center justify-between p-5 text-3xl font-bold transition-transform cursor-pointer h-36 text-mint-200 hover:scale-110 hover:z-10 hover:drop-shadow-md"
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
  </div>
</template>

<script lang="ts" setup>
import { ref, Ref } from 'vue'
import {
  techSections,
  technologies,
  Technologies,
  Section,
} from '@/data/technologies'
import hexRgb from 'hex-rgb'

const sections: Ref<Section[]> = ref(techSections)
const techs: Ref<Technologies> = ref(technologies)

const lighten = (hex: string) => {
  const rgbColor = hexRgb(hex, { format: 'array', alpha: 1 })

  return `rgba(${rgbColor
    .map((c, index) => (index < 3 ? Math.round(c * 1.3) : c))
    .join(', ')})`
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
