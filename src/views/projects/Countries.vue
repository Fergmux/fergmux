<template>
  <div>
    <div class="bg-img bg-img-cover min-h-screen">
      <div class="flex flex-col items-center pt-20">
        <h1 class="mb-14 text-5xl font-semibold underline">Countries</h1>
        <div class="text-xl">
          <button
            class="m-auto w-40 text-center"
            :class="{
              underline: subComponent === SubComponent.ZenMode,
            }"
            @click="subComponent = SubComponent.ZenMode"
          >
            Zen Mode
          </button>
          <button
            class="mx-4 w-40 text-center"
            :class="{
              underline: subComponent === SubComponent.ChallengeMode,
            }"
            @click="subComponent = SubComponent.ChallengeMode"
          >
            Challenge Mode
          </button>
        </div>
        <component :is="componentMap[subComponent]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChallengeMode from './countries/ChallengeMode.vue'
import ZenMode from './countries/ZenMode.vue'

enum SubComponent {
  ZenMode = 'ZenMode',
  ChallengeMode = 'ChallengeMode',
}

const componentMap = {
  [SubComponent.ZenMode]: ZenMode,
  [SubComponent.ChallengeMode]: ChallengeMode,
}

const subComponent = ref(SubComponent.ZenMode)
</script>
