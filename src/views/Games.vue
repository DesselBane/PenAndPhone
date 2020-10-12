<template>
  <CList>
    <CListItem v-for="game in games" :key="game.id">
      <router-link :to="`/game/${game.id}/overview`">{{
        game.name
      }}</router-link>
    </CListItem>
  </CList>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { storeInstance, createGameMockData } from '../store/data-store'
import CList from '@components/CList.vue'
import CListItem from '@components/CListItem.vue'

export default defineComponent({
  name: 'Games',
  components: {
    CList,
    CListItem,
  },
  setup() {
    createGameMockData()

    return {
      games: storeInstance.games,
    }
  },
})
</script>

<style scoped></style>
