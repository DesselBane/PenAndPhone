import { createRouter, createWebHashHistory } from 'vue-router'

import Home from './Home.vue'
import Splittermond from './splittermond/Splittermond.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/splittermond', component: Splittermond },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
