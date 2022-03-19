<template>
  <div class="min-h-screen py-20 pt-28 bg-img bg-img-cover">
    <div
      class="flex flex-col items-center justify-center max-w-screen-xl m-auto"
    >
      <div class="text-center">
        <h1 class="font-bold text-8xl mb-7 text-mint-900 drop-shadow-3xl">
          Fergmux
        </h1>
        <p class="text-lg mb-7 drop-shadow-3xl">
          Hi, my name's Fergus - welcome to my website.
        </p>
      </div>
      <main class="grid p-20 md:grid-cols-2">
        <section
          v-for="item in menuItems"
          :key="item.route"
          class="px-10 py-5 menu-section"
        >
          <router-link class="m-2" :to="{ name: item.route }">
            <h2 class="text-5xl font-semibold drop-shadow-3xl">
              {{ item.name }}
            </h2>
            <p class="py-5 text-lg drop-shadow-3xl">{{ item.text }}</p>
          </router-link>
        </section>
      </main>

      <div
        class="absolute bottom-0 flex items-center justify-center w-full my-4"
      >
        <a class="mx-3" href="https://github.com/Fergmux" target="_blank">
          <img src="@/assets/images/icons/github.svg" alt="GitHub" />
        </a>

        <a
          class="mx-3"
          href="https://www.linkedin.com/in/fergusmull/"
          target="_blank"
        >
          <img src="@/assets/images/icons/linkedin.svg" alt="LinkedIn" />
        </a>

        <form
          class="mx-3 -mb-1"
          action="https://www.paypal.com/donate"
          method="post"
          target="_blank"
        >
          <input type="hidden" name="hosted_button_id" value="XCT76DGPUL6AN" />
          <button
            type="submit"
            name="submit"
            title="PayPal - The safer, easier way to pay online!"
            alt="Donate with PayPal button"
          >
            <img src="@/assets/images/icons/paypal.svg" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { menuConfig } from '@/data/menuConfig'

const menuItems = ref(menuConfig.filter((item) => item.route !== 'home'))
</script>

<style lang="scss" scoped>
.bg-img {
  background-image: url('@/assets/images/backgrounds/wave.svg');
}
</style>
