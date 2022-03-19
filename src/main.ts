import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import DKToast from 'vue-dk-toast'

createApp(App)
  .use(router)
  .use(DKToast, {
    positionX: 'center',
    positionY: 'top',
    max: 1,
    duration: 3000,
    class: 'text-mint-500',
  })
  .mount('#app')
