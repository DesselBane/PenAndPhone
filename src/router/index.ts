import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import EditChar from '../views/EditChar.vue'
import Playground from '../views/Playground.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/edit-char',
    name: 'EditChar',
    component: EditChar,
  },
  {
    path: '/playground',
    name: 'Playground',
    component: Playground,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
