<template>
  <div class="app min-h-screen relative">
    <div class="fixed flex justify-between z-20 w-full">
      <router-link
        to="/"
        class="material-icons md-dark cursor-pointer m-2 text-xl"
      >
        home
      </router-link>
      <div
        @click="showMenu = !showMenu"
        class="material-icons md-dark cursor-pointer m-2 text-2xl"
      >
        menu
      </div>
    </div>

    <div>
      <router-view></router-view>
    </div>

    <Transition name="slide-right">
      <div
        v-if="showMenu"
        class="h-full bg-zinc-100 dark:bg-neutral-900 w-80 menu absolute top-0 right-0 border-l border-stone-200 dark:border-stone-800 shadow-out pt-12"
      >
        <router-link
          v-for="item in menuItems"
          :key="item.route"
          :to="{ name: item.route }"
          @click="showMenu = false"
        >
          <div
            class="h-14 bg-zinc-200 dark:bg-neutral-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 cursor-pointer border-t border-b border-stone-200 dark:border-stone-800 flex items-center p-5"
          >
            {{ item.name }}
          </div>
        </router-link>
        <div
          @click="showProjects = !showProjects"
          class="h-14 bg-zinc-200 dark:bg-neutral-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 cursor-pointer border-t border-b border-stone-200 dark:border-stone-800 flex justify-between items-center p-5"
        >
          Projects
          <span
            class="material-icons-outlined transition-transform duration-500"
            :class="{ 'rotate-180': showProjects }"
          >
            arrow_drop_down
          </span>
        </div>
        <Transition name="grow">
          <div v-if="showProjects" class="projects">
            <router-link
              v-for="project in projects"
              :key="project.route"
              :to="{ name: project.route }"
              @click="showMenu = false"
            >
              <div
                class="h-14 pl-8 bg-zinc-200 dark:bg-neutral-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 cursor-pointer border-t border-b border-stone-200 dark:border-stone-800 flex items-center p-5"
              >
                {{ project.name }}
              </div>
            </router-link>
          </div>
        </Transition>
        <div
          @click="toggleDark"
          class="material-icons md-dark cursor-pointer m-2 mb-3 text-md z-30 absolute top-1"
        >
          {{ darkMode ? 'light_mode' : 'dark_mode' }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import './index.css'
import { provide, ref, onMounted } from 'vue'
import { menuConfig, projectConfig } from '@/data/menuConfig'

export default {
  setup() {
    const darkMode = ref(false)
    provide('dark', darkMode)

    const showMenu = ref(false)
    const showProjects = ref(false)

    const menuItems = ref(menuConfig)
    const projects = ref(projectConfig)

    const toggleDark = () => {
      darkMode.value = !darkMode.value
      document.querySelector('html').classList.toggle('dark')
      localStorage.setItem('darkMode', JSON.stringify(darkMode.value))
    }

    onMounted(() => {
      const localDark = JSON.parse(localStorage.getItem('darkMode'))
      const systemDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches

      if (localDark != null) {
        if (darkMode.value !== localDark) {
          toggleDark()
        }
      } else if (systemDark) {
        toggleDark()
      }
    })

    return { darkMode, showMenu, menuItems, showProjects, projects, toggleDark }
  },
}
</script>

<style lang="scss">
.app {
  font-family: 'Inter', Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* we will explain what these classes do next! */
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
</style>
