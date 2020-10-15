<template>
  <CList>
    <CListItem v-for="game in games" :key="game.id">
      <router-link :to="`/game/${game.id}/overview`">{{
        game.name
      }}</router-link>
    </CListItem>
    <CListItem>
      <EpicButton @click="handleAddGame">+</EpicButton>
    </CListItem>
  </CList>
</template>

<script lang="ts">
import { Character } from '@models/character'
import { Game } from '@models/game'
import { defineComponent } from 'vue'
import { storeInstance } from '../store/data-store'
import CList from '@components/CList.vue'
import CListItem from '@components/CListItem.vue'
import EpicButton from '@components/EpicButton'

export default defineComponent({
  name: 'Games',
  components: {
    CList,
    CListItem,
    EpicButton,
  },
  setup() {
    if (storeInstance.games.value.length === 0) {
      const game = new Game(0)
      game.name = 'A very epic adventure!!!einsELF!11!1'
      storeInstance.games.value.push(game)
      const char = new Character(0)
      char.name = 'Sinthoras'
      game.characters.push(char)

      storeInstance.saveToLocalStorage()
    }

    return {
      games: storeInstance.games,
    }
  },
  methods: {
    handleAddGame() {
      const game = new Game()
      game.name = 'foo'
      storeInstance.addGame(game)
    },
  },
})
</script>

<style scoped></style>
