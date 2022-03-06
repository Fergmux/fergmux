import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/about/:submit?',
    name: 'about',
    component: () =>
      import(/* webpackChunkName: "about" */ '@/views/About.vue'),
  },
  {
    path: '/career',
    name: 'career',
    component: () =>
      import(/* webpackChunkName: "career" */ '@/views/Career.vue'),
  },
  {
    path: '/projects/technology',
    name: 'technology',
    component: () =>
      import(/* webpackChunkName: "technology" */ '@/views/Technology.vue'),
  },
  {
    path: '/projects/game-chart',
    name: 'game-chart',
    component: () =>
      import(/* webpackChunkName: "game-chart" */ '@/views/GameChart.vue'),
  },
  {
    path: '/projects/pong',
    name: 'pong',
    component: () => import(/* webpackChunkName: "pong" */ '@/views/Pong.vue'),
  },
  {
    path: '/projects/rain',
    name: 'rain',
    component: () => import(/* webpackChunkName: "rain" */ '@/views/Rain.vue'),
  },
  {
    path: '/projects/wave',
    name: 'wave',
    component: () => import(/* webpackChunkName: "wave" */ '@/views/Wave.vue'),
  },
  {
    path: '/projects/wordle-solver',
    name: 'wordle',
    component: () =>
      import(/* webpackChunkName: "wordle" */ '@/views/Wordle.vue'),
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
