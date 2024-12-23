<template>
  <Transition name="slide-right">
    <div
      v-if="props.modelValue"
      class="menu fixed right-0 top-0 z-20 h-full w-80 border-l border-mint-300 bg-mint-200 drop-shadow-3xl"
    >
      <div class="flex w-full items-center justify-end">
        <div
          class="material-icons md-dark m-2 cursor-pointer text-3xl"
          @click="hideMenu"
        >
          close
        </div>
      </div>

      <div class="mb-5">
        <div
          v-if="!userState.showLogin"
          class="menu-item p-5"
          @click="changeUserClicked"
        >
          {{ userState.userAuthorised ? 'Logout' : 'Change user' }}
        </div>

        <div
          v-if="!userState.showLogin && !userState.userAuthorised"
          class="menu-item p-5"
          @click="login"
        >
          Login
        </div>
      </div>

      <router-link
        v-for="item in menuItems"
        :key="item.route"
        :to="{ name: item.route }"
        @click="hideMenu"
      >
        <div class="menu-item p-5">
          {{ item.name }}
        </div>
      </router-link>

      <router-link :to="{ name: 'projects' }" @click="hideMenu">
        <div
          class="menu-item p-5"
          @mouseover="showProjects[0] = true"
          @mouseleave="hideProjects(0)"
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
            @click="hideMenu"
          >
            <div class="menu-item p-5 pl-8">
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
import { changeUser, userState } from '@/store/lifeTrackerStore'
import { ref } from 'vue'

const props = defineProps({
  modelValue: Boolean,
})

const showProjects = ref([false, false])
const projects = ref(projectConfig)

const menuItems = ref(menuConfig.filter((item) => item.route !== 'projects'))

const hideProjects = (num: number) => {
  window.setTimeout(() => {
    showProjects.value[num] = false
  }, 10)
}

const emit = defineEmits(['update:modelValue'])

const hideMenu = () => {
  emit('update:modelValue', false)
}

const changeUserClicked = () => {
  changeUser()
  hideMenu()
}

const login = () => {
  userState.showLogin = true
  hideMenu()
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
</style>

<style lang="postcss">
.menu-item {
  @apply flex h-14 cursor-pointer items-center justify-between border-b border-t border-mint-300 bg-mint-300 hover:bg-mint-800 hover:text-mint-300;
}
</style>
