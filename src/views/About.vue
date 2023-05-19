<template>
  <div class="bg-img bg-img-cover">
    <div
      class="relative m-auto min-h-screen max-w-screen-xl px-10 pt-20 md:px-14 lg:px-20 lg:py-20 lg:pt-24"
    >
      <div class="md md:w-3/4 lg:w-2/4">
        <h1 class="header-main mb-14">About Me</h1>
        <p class="mb-8 drop-shadow-3xl">
          Hi, my name's Fergus Mullineux, I'm a programmer/developer/general
          nerd, I mostly write frontend code but specialise in Vue. I briefly
          studied engineering at Oxford Univeristy before deciding to become a
          programmer. I tought myself to code and got a job helping at a
          friend's startup. I enjoyed it so much I enrolled at Bristol
          University studying computer science for three years. I now have over
          four years commercial experience with the majroity of that time spent
          as a frontend developer. You can check out my experience in more
          detail
          <router-link to="career" class="link">here</router-link>, or check out
          my CV <a href="/cv.html" class="link">here</a>.
        </p>
        <p class="mb-6 drop-shadow-3xl">
          If you want to get in touch with me you can message me on
          <a
            href="https://www.linkedin.com/in/fergusmull/"
            target="_blank"
            class="link"
            >LinkedIn</a
          >, or send a message with the form below.
        </p>

        <h2 class="mt-20 mb-7 text-3xl font-semibold drop-shadow-3xl">
          Contact Form
        </h2>
        <form
          id="contact"
          name="contact"
          netlify
          data-netlify-honeypot="bot-field"
          class="mb-10"
        >
          <input type="hidden" name="form-name" value="contact" />
          <input type="hidden" name="bot-field" />
          <p>
            <label class="block drop-shadow-3xl">Your name</label>
            <input
              v-model="formFields.name"
              type="text"
              name="name"
              class="text-field h-8"
            />
          </p>
          <p>
            <label class="block drop-shadow-3xl">Your email</label>
            <input
              v-model="formFields.email"
              type="email"
              name="email"
              class="text-field h-8"
            />
          </p>
          <p>
            <label class="block drop-shadow-3xl">Your message</label>
            <textarea
              v-model="formFields.message"
              name="message"
              class="text-field"
            />
          </p>
          <p>
            <button type="submit" class="button-light mt-4">Send</button>
          </p>
        </form>
      </div>
      <img
        src="/src/assets/images/me.png"
        class="bottom-0 right-10 m-auto w-full max-w-md drop-shadow-3xl lg:fixed lg:h-4/5 lg:w-auto lg:max-w-full"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useToast } from '@/composables/toast'

const { toast } = useToast()

const formFields = ref({
  name: '',
  email: '',
  message: '',
})

onMounted(() => {
  document.querySelector('form')?.addEventListener('submit', handleSubmit)
})

const handleSubmit = async (e: SubmitEvent) => {
  e.preventDefault()
  const myForm = document.getElementById('contact') as HTMLFormElement
  const formData = new FormData(myForm)

  try {
    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(
        Array.from(formData.entries()).map((x) => x.map((y) => y as string))
      ).toString(),
    })
  } catch (e) {
    toast('Sorry something went wrong when submitting your message')
    return
  }

  toast('Thanks for your message!')

  formFields.value = {
    name: '',
    email: '',
    message: '',
  }
}
</script>

<style lang="scss" scoped>
.bg-img {
  background-image: url('@/assets/images/backgrounds/curve.svg');
}
</style>
