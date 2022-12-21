<template>
  <div class="min-h-screen pt-20 text-center bg-img bg-img-cover">
    <h1 class="mb-7 header-main">Career</h1>

    <div class="flex items-center justify-around w-full">
      <div class="relative w-4/5 text-right">
        <div
          v-for="(section, index) in sections"
          :key="section.year"
          class="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-end w-4/5 m-auto"
          :class="{
            'section--show': index === sectionIndex,
            'z-20': index === sectionIndex,
            'section--before': index < sectionIndex,
            'section--after': index > sectionIndex,
          }"
        >
          <div>
            <a
              :href="index === sectionIndex ? section.link : undefined"
              target="_blank"
            >
              <h3
                class="mb-2 text-4xl font-bold drop-shadow-3xl"
                :class="{ 'cursor-pointer': index === sectionIndex }"
              >
                {{ section.title }}
              </h3>
            </a>
            <h4 class="mb-4 text-2xl font-bold text-mint-800 drop-shadow-3xl">
              {{ section.subtitle }}
            </h4>
            <p class="drop-shadow-3xl">{{ section.text }}</p>
          </div>
        </div>
      </div>

      <ul class="p-4 mr-20 years">
        <li
          class="text-5xl material-icons drop-shadow-3xl"
          :class="{
            'text-slate-500': !(sectionIndex > 0),
            'cursor-pointer': sectionIndex > 0,
          }"
          @click="sectionIndex = sectionIndex > 0 ? sectionIndex - 1 : 0"
        >
          expand_less
        </li>
        <li
          v-for="(section, index) in sections"
          :key="section.year"
          class="m-4 text-2xl cursor-pointer year drop-shadow-3xl"
          :class="{ 'year--active': index === sectionIndex }"
          @click="sectionIndex = index"
        >
          {{ section.year }}
        </li>
        <li
          :class="{
            'text-slate-500': !(sectionIndex < maxSec),
            'cursor-pointer': sectionIndex < maxSec,
          }"
          class="text-5xl rotate-180 material-icons drop-shadow-3xl"
          @click="
            sectionIndex =
              sectionIndex < maxSec ? sectionIndex + 1 : sectionIndex
          "
        >
          expand_less
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { careerSections } from '@/data/menuConfig'

const sectionIndex = ref(0)
const sections = careerSections
const maxSec = computed(() => sections.length - 1)
</script>

<style lang="scss" scoped>
.bg-img {
  background-image: url('@/assets/images/backgrounds/sprinkle.svg');
}

.years {
  min-width: 150px;
}

.year {
  font-weight: normal;
  transition: font-weight 0.5s ease-in-out, color 0.5s ease-in-out;

  &--active {
    font-weight: bold;
    color: theme('colors.mint.800');
    transition: font-weight 0.5s ease-in-out, color 0.5s ease-in-out;
  }
}

.section {
  &--before {
    opacity: 0;
    top: 50px;
    transition: opacity 0.5s ease-in-out, top 0.5s ease-in-out;
  }

  &--after {
    opacity: 0;
    top: -50px;
    transition: opacity 0.5s ease-in-out, top 0.5s ease-in-out;
  }

  &--show {
    height: 500px;
    content: ' ';
    opacity: 1;
    transition: opacity 0.5s ease-in-out, top 0.5s ease-in-out;
    transition-delay: 0.4s;
  }
}
</style>
