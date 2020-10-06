import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import EditChar from '../views/EditChar.vue'

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
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
