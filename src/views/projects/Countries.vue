<template>
  <div>
    <div class="bg-img bg-img-cover min-h-screen">
      <div class="flex flex-col items-center pt-20">
        <h1 class="mb-14 text-5xl font-semibold underline">Countries</h1>
        <div class="text-2xl">
          <div
            class="m-auto inline-block w-56 text-center"
            :class="{
              'text-mint-800': subComponent === SubComponent.ZenMode,
              'cursor-pointer opacity-70':
                subComponent !== SubComponent.ZenMode,
            }"
            @click="subComponent = SubComponent.ZenMode"
          >
            Zen Mode
          </div>
          <div
            class="mx-4 inline-block w-56 text-center"
            :class="{
              'text-mint-800': subComponent === SubComponent.ChallengeMode,
              'cursor-pointer opacity-70':
                subComponent !== SubComponent.ChallengeMode,
            }"
            @click="subComponent = SubComponent.ChallengeMode"
          >
            Challenge Mode
          </div>
        </div>
        <component
          :is="componentMap[subComponent]"
          class="m-14 rounded-xl bg-mint-400/90 p-14 shadow-2xl"
        />
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

<style lang="scss" scoped>
.bg-img {
  background-image: url('@/assets/images/backgrounds/map.svg');
}
</style>
