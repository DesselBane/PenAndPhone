import { createRouter, createWebHashHistory } from 'vue-router'

import HomeView from './HomeView.vue'
import SplittermondView from './splittermond/SplittermondView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/splittermond', component: SplittermondView },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
