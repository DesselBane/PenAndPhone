import CharEdit from '@views/CharEdit'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Games from '@views/Games'
import GameOverview from '@views/GameOverview'
import Playground from '@views/Playground'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/games',
  },
  {
    path: '/games',
    name: 'Games',
    component: Games,
  },
  {
    path: '/game/:gameId',
    name: 'GameOverview',
    component: GameOverview,
  },
  {
    path: '/char/:charId/edit',
    name: 'CharEdit',
    component: CharEdit,
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
