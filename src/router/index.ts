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
    path: '/projects',
    name: 'projects',
    component: () =>
      import(/* webpackChunkName: "projects" */ '@/views/Projects.vue'),
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
      import(
        /* webpackChunkName: "game-chart" */ '@/views/projects/GameChart.vue'
      ),
  },
  {
    path: '/projects/pong',
    name: 'pong',
    component: () =>
      import(/* webpackChunkName: "pong" */ '@/views/projects/Pong.vue'),
  },
  {
    path: '/projects/rain',
    name: 'rain',
    component: () =>
      import(/* webpackChunkName: "rain" */ '@/views/projects/Rain.vue'),
  },
  {
    path: '/projects/wave',
    name: 'wave',
    component: () =>
      import(/* webpackChunkName: "wave" */ '@/views/projects/Wave.vue'),
  },
  {
    path: '/projects/wordle-solver',
    name: 'wordle',
    component: () =>
      import(/* webpackChunkName: "wordle" */ '@/views/projects/Wordle.vue'),
  },
  {
    path: '/projects/siege',
    name: 'siege',
    component: () =>
      import(/* webpackChunkName: "siege" */ '@/views/projects/Siege.vue'),
  },
  {
    path: '/projects/chess/:id?',
    name: 'chess',
    component: () =>
      import(/* webpackChunkName: "chess" */ '@/views/projects/Chess.vue'),
  },
  {
    path: '/projects/dice',
    name: 'dice',
    component: () =>
      import(/* webpackChunkName: "dice" */ '@/views/projects/DiceResults.vue'),
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
