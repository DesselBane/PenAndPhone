import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '@views/Home'
import Games from '@views/Games'
import GameOverview from '@views/GameOverview'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },

  {
    path: '/games',
    name: 'Games',
    component: Games,
  },
  {
    path: '/game/:gameId/overview',
    name: 'GameOverview',
    component: GameOverview,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
