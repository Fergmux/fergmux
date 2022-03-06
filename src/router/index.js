import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/game-chart',
    name: 'game-chart',
    component: () =>
      import(/* webpackChunkName: "game-chart" */ '@/views/GameChart.vue'),
  },
  {
    path: '/pong',
    name: 'pong',
    component: () => import(/* webpackChunkName: "pong" */ '@/views/Pong.vue'),
  },
  {
    path: '/rain',
    name: 'rain',
    component: () => import(/* webpackChunkName: "rain" */ '@/views/Rain.vue'),
  },
  {
    path: '/wave',
    name: 'wave',
    component: () => import(/* webpackChunkName: "wave" */ '@/views/Wave.vue'),
  },
  {
    path: '/wordle-solver',
    name: 'wordle',
    component: () =>
      import(/* webpackChunkName: "wordle" */ '@/views/Wordle.vue'),
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
    path: '/technology',
    name: 'technology',
    component: () =>
      import(/* webpackChunkName: "technology" */ '@/views/Technology.vue'),
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
