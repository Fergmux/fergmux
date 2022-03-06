<template>
  <div class="flex flex-col items-center pt-20">
    <h1 class="text-4xl mb-7 underline">Fergmux</h1>
    <p class="mb-7">Hi, my name's Fergus - welcome to my website.</p>
    <p class="mt-4">Here's some cool new stuff I made:</p>
    <div class="underline text-lg mb-7 font-semibold">
      <router-link class="m-2" :to="{ name: 'game-chart' }"
        >Game Chart</router-link
      >
      <router-link class="m-2" :to="{ name: 'wordle' }"
        >Wordle Solver</router-link
      >
    </div>

    <p class="mt-4">Here's some random old stuff I made:</p>
    <div class="underline text-lg font-semibold mb-2">
      <router-link class="m-2" :to="{ name: 'pong' }">Pong</router-link>
      <router-link class="m-2" :to="{ name: 'rain' }">Rain</router-link>
      <router-link class="m-2" :to="{ name: 'wave' }">Wave</router-link>
    </div>

    <p class="mt-4">Here's some random old stuff I made:</p>
    <div class="underline text-lg font-semibold mb-2">
      <router-link class="m-2" :to="{ name: 'about' }">About me</router-link>
      <router-link class="m-2" :to="{ name: 'career' }">Experience</router-link>
      <router-link class="m-2" :to="{ name: 'technology' }"
        >Knowledge</router-link
      >
    </div>

    <div class="absolute bottom-0 flex justify-center w-full items-center my-4">
      <a class="mx-3" href="https://github.com/Fergmux" target="_blank">
        <img :src="githubImage" alt="GitHub" />
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
</template>

<script>
import { computed, inject } from 'vue'
import githubBlack from '@/assets/images/icons/github.svg'
import githubWhite from '@/assets/images/icons/github-dark.svg'

export default {
  setup() {
    const dark = inject('dark', false)

    const githubImage = computed(() => (dark.value ? githubWhite : githubBlack))

    return { githubImage }
  },
}
</script>
