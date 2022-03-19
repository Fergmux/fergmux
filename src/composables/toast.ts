import Toast from '@/components/Toast.vue'
import { defineComponent, createApp } from 'vue'

const div = document.createElement('div')
document.body.appendChild(div)

interface ToastOptions {
  time?: number
}

export function useToast() {
  const toast = (message: string, options: ToastOptions = {}) => {
    const time = options?.time ?? 3000

    const buttonView = defineComponent({
      extends: Toast,
      setup() {
        const text = message
        return {
          text,
        }
      },
    })

    const app = createApp(buttonView)
    app.mount(div)

    const toast = document.getElementById('toast')

    if (toast) {
      setTimeout(() => {
        toast.classList.add('show')
      }, 10)

      setTimeout(() => {
        toast.classList.remove('show')
      }, time)

      setTimeout(() => {
        app.unmount()
      }, time + 500)
    }
  }

  return { toast }
}
