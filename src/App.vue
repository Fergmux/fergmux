<template>
  <div class="app min-h-screen relative">
    <div class="fixed flex justify-between z-10 w-full">
      <router-link
        to="/"
        class="material-icons cursor-pointer m-2 mx-3 text-2xl"
      >
        home
      </router-link>
      <div
        @click="showMenu = true"
        class="material-icons cursor-pointer m-2 mx-3 text-3xl"
      >
        menu
      </div>
    </div>

    <router-view></router-view>

    <Transition name="slide-right">
      <div
        v-if="showMenu"
        class="h-full bg-mint-200 w-80 menu fixed top-0 right-0 border-l border-mint-300 shadow-out z-20"
      >
        <div class="w-full flex justify-end items-center">
          <div
            @click="showMenu = false"
            class="material-icons md-dark cursor-pointer m-2 text-3xl"
          >
            close
          </div>
        </div>
        <router-link
          v-for="item in menuItems"
          :key="item.route"
          :to="{ name: item.route }"
          @click="showMenu = false"
        >
          <div class="menu-item p-5">
            {{ item.name }}
          </div>
        </router-link>

        <router-link :to="{ name: 'projects' }" @click="showMenu = false">
          <div
            @mouseover="showProjects[0] = true"
            @mouseleave="hideProjects(0)"
            class="menu-item p-5"
          >
            Projects
            <span
              class="material-icons-outlined transition-transform duration-500"
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
              @click="showMenu = false"
            >
              <div class="menu-item p-5 pl-8">
                {{ project.name }}
              </div>
            </router-link>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script>
import './index.css'
import { ref } from 'vue'
import { menuConfig, projectConfig } from '@/data/menuConfig'

export default {
  setup() {
    const showMenu = ref(false)
    const showProjects = ref([false, false])
    const projects = ref(projectConfig)

    const menuItems = ref(
      menuConfig.filter((item) => item.route !== 'projects')
    )

    const hideProjects = (num) => {
      window.setTimeout(() => {
        console.log(showProjects.value)
        showProjects.value[num] = false
      }, 10)
    }

    return {
      showMenu,
      menuItems,
      showProjects,
      projects,
      hideProjects,
    }
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

.menu-item {
  @apply h-14 bg-mint-300 hover:bg-mint-600 cursor-pointer border-t border-b border-mint-300 flex items-center justify-between;
}
</style>
