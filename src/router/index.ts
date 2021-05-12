import CharEdit from '@views/CharEdit.vue'
import CharOverview from '@views/CharOverview.vue'
import GameOverview from '@views/GameOverview.vue'
import Games from '@views/Games.vue'
import Playground from '@views/Playground.vue'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

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
    path: '/char/:charId',
    name: 'CharOverview',
    component: CharOverview,
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
