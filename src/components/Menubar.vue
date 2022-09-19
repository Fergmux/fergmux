<template>
  <Transition name="slide-right">
    <div
      v-if="props.modelValue"
      class="fixed top-0 right-0 z-20 h-full border-l bg-mint-200 w-80 menu border-mint-300 drop-shadow-3xl"
    >
      <div class="flex items-center justify-end w-full">
        <div
          class="m-2 text-3xl cursor-pointer material-icons md-dark"
          @click="hideMenu"
        >
          close
        </div>
      </div>

      <div class="p-5 menu-item" @click="login()">Login</div>

      <router-link
        v-for="item in menuItems"
        :key="item.route"
        :to="{ name: item.route }"
        @click="hideMenu"
      >
        <div class="p-5 menu-item">
          {{ item.name }}
        </div>
      </router-link>

      <router-link :to="{ name: 'projects' }" @click="hideMenu">
        <div
          class="p-5 menu-item"
          @mouseover="showProjects[0] = true"
          @mouseleave="hideProjects(0)"
        >
          Projects
          <span
            class="transition-transform duration-500 material-icons-outlined"
            :class="{ 'rotate-180': showProjects.some(Boolean) }"
          >
            arrow_drop_down
          </span>
        </div>
      </router-link>

      <Transition name="grow">
        <div
          v-if="showProjects.some(Boolean)"
          class="projects"
          @mouseover="showProjects[1] = true"
          @mouseleave="hideProjects(1)"
        >
          <router-link
            v-for="project in projects"
            :key="project.route"
            :to="{ name: project.route }"
            @click="hideMenu"
          >
            <div class="p-5 pl-8 menu-item">
              {{ project.name }}
            </div>
          </router-link>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { menuConfig, projectConfig } from '@/data/menuConfig'
import { ref } from 'vue'

const props = defineProps({
  modelValue: Boolean,
})

const showProjects = ref([false, false])
const projects = ref(projectConfig)

const menuItems = ref(menuConfig.filter((item) => item.route !== 'projects'))

const hideProjects = (num: number) => {
  window.setTimeout(() => {
    console.log(showProjects.value)
    showProjects.value[num] = false
  }, 10)
}

const emit = defineEmits(['update:modelValue', 'login'])

const hideMenu = () => {
  emit('update:modelValue', false)
}

const login = () => {
  hideMenu()
  emit('login')
}
</script>

<style lang="scss">
.slide-right-enter-active,
.slide-right-leave-active {
  transition: right 0.5s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
  right: -20rem;
}

.projects {
  max-height: 100%;
  overflow: hidden;
}

.grow-enter-active,
.grow-leave-active {
  transition: max-height 0.5s ease;
}

.grow-enter-from,
.grow-leave-to {
  max-height: 0;
}

.rotate {
  transition: spin 0.5s ease 1;
}

.menu-item {
  @apply h-14 bg-mint-300 hover:bg-mint-800 cursor-pointer border-t border-b border-mint-300 flex items-center justify-between hover:text-mint-300;
}
</style>