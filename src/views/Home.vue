<template>
  <div class="m-auto flex flex-col items-center pt-10">
    <h1 class="text-4xl mb-7 underline">Fergmux</h1>
    <p class="mb-7">Hi, my name's Fergus - welcome to my website.</p>
    <p class="mb-4">Here's some cool new stuff I made:</p>
    <div class="underline text-lg mb-7 font-semibold">
      <router-link class="m-2" to="game-chart">Game Chart</router-link>
      <router-link class="m-2" to="wordle-solver">Wordle Solver</router-link>
    </div>

    <p class="mb-4">Here's some random old stuff I made:</p>
    <div class="underline text-lg font-semibold">
      <router-link class="m-2" to="pong">Pong</router-link>
      <router-link class="m-2" to="rain">Rain</router-link>
      <router-link class="m-2" to="wave">Wave</router-link>
    </div>

    <div class="absolute bottom-0 flex justify-center w-full items-center my-4">
      <a class="mx-3" href="https://github.com/Fergmux">
        <img :src="githubImage" alt="GitHub" />
      </a>

      <a class="mx-3" href="https://www.linkedin.com/in/fergusmull/">
        <img src="@/assets/icons/linkedin.svg" alt="LinkedIn" />
      </a>

      <form
        class="mx-3 -mb-1"
        action="https://www.paypal.com/donate"
        method="post"
        target="_top"
      >
        <input type="hidden" name="hosted_button_id" value="XCT76DGPUL6AN" />
        <button
          type="submit"
          name="submit"
          title="PayPal - The safer, easier way to pay online!"
          alt="Donate with PayPal button"
        >
          <img src="@/assets/icons/paypal.svg" />
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { computed, inject } from 'vue'
import githubBlack from '@/assets/icons/github.svg'
import githubWhite from '@/assets/icons/github-dark.svg'

export default {
  setup() {
    const dark = inject('dark', false)

    const githubImage = computed(() => (dark.value ? githubWhite : githubBlack))

    return { githubImage }
  },
}
</script>
