import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/game-chart',
    name: 'game-chart',
    component: () => import(/* webpackChunkName: "game-chart" */ '@/views/GameChart.vue')
  },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})
