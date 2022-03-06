<template>
  <div
    class="px-10 pt-14 md:px-14 lg:px-20 lg:pt-20 relative max-w-screen-xl min-h-screen m-auto"
  >
    <div class="md md:w-3/4 lg:w-2/4">
      <h1 class="text-4xl mb-7 underline">About Me</h1>
      <p class="mb-6">
        Hi, my name's Fergus Mullineux, I'm a programmer/developer/general nerd,
        I mostly write frontend code but specialise in Vue. I briefly studied
        engineering at Oxford Univeristy before deciding to become a programmer.
        I tought myself to code and got a job helping at a friend's startup. I
        enjoyed it so much I enrolled at Bristol University studying computer
        science for three years. I now have over four years commercial
        experience with the majroity of that time spent as a frontend developer.
        You can check out my experience in more detail
        <router-link class="underline cursor-pointer text-sky-600" to="career"
          >here</router-link
        >.
      </p>
      <p class="mb-6">
        If you want to get in touch with me you can message me on
        <a
          href="https://www.linkedin.com/in/fergusmull/"
          target="_blank"
          class="underline text-sky-600"
          >LinkedIn</a
        >, or send a message with the form below.
      </p>

      <h2 class="text-2xl mt-10 mb-4 underline">Contact Form</h2>
      <form
        name="contact"
        id="contact"
        netlify
        data-netlify-honeypot="bot-field"
        class="mb-10"
      >
        <input type="hidden" name="form-name" value="contact" />
        <input type="hidden" name="bot-field" />
        <p>
          <label class="block">Your name</label>
          <input
            v-model="formFields.name"
            type="text"
            name="name"
            class="border-solid border border-slate-400 rounded-sm mb-4 mt-1 w-full sm:w-80 h-8 p-2 bg-inherit"
          />
        </p>
        <p>
          <label class="block">Your email</label>
          <input
            v-model="formFields.email"
            type="email"
            name="email"
            class="border-solid border border-slate-400 rounded-sm mb-4 mt-1 w-full sm:w-80 h-8 p-2 bg-inherit"
          />
        </p>
        <p>
          <label class="block">Your message</label>
          <textarea
            v-model="formFields.message"
            name="message"
            class="border-solid border border-slate-400 rounded-sm mb-4 mt-1 w-full sm:w-80 p-2 bg-inherit"
          />
        </p>
        <p>
          <button
            type="submit"
            class="bg-sky-600 hover:bg-sky-800 text-white font-bold py-2 px-4 rounded mt-2 p-2"
          >
            Send
          </button>
        </p>
      </form>
    </div>
    <img
      src="/src/assets/images/me.png"
      class="max-w-md w-full lg:w-auto lg:max-w-full lg:h-4/5 lg:fixed right-10 bottom-0 m-auto"
    />
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useToast } from '@/composables/toast.js'

export default {
  setup() {
    const { toast } = useToast()

    const formFields = ref({
      name: '',
      email: '',
      message: '',
    })

    onMounted(() => {
      document.querySelector('form').addEventListener('submit', handleSubmit)
    })

    const handleSubmit = async (e) => {
      e.preventDefault()
      const myForm = document.getElementById('contact')
      const formData = new FormData(myForm)

      try {
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString(),
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

    return { formFields }
  },
}
</script>