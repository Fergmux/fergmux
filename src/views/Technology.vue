<template>
  <div class="bg-img bg-img-cover overflow-x-hidden">
    <div class="py-20">
      <div class="mb-20 mt-10 text-center">
        <h1 class="header-main mb-4">Technologies</h1>
        <p class="mb-7 drop-shadow-3xl">
          A list of technologies and tools that I use, or have used.
        </p>
      </div>

      <section
        v-for="section in sections"
        :key="section.key"
        class="m-auto max-w-screen-xl"
      >
        <div class="flex h-60 w-full flex-col items-center justify-center">
          <h1 class="mb-4 text-5xl font-semibold drop-shadow-3xl">
            {{ section.title }}
          </h1>
          <p class="drop-shadow-3xl">{{ section.subtitle }}</p>
        </div>
        <div class="tech-grid col-auto grid grid-flow-row">
          <a
            v-for="tech in techs[section.key]"
            :key="tech.id"
            :href="tech.link"
            target="_blank"
          >
            <div
              :style="{ backgroundColor: lighten(tech.color) }"
              class="flex h-36 cursor-pointer items-center justify-between p-5 text-3xl font-bold text-mint-200 transition-transform hover:z-10 hover:scale-110 hover:drop-shadow-md"
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
