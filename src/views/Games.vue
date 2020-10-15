<template>
  <EpicHeading class="mb-7">Deine Spiele</EpicHeading>
  <EpicCard class="mb-8" v-for="{ id, name } in games" :key="id">
    <EpicHeading as="h3" class="mb-4">{{ name }}</EpicHeading>
    <EpicButton as="router-link" :to="`/game/${id}/overview`"
      >Spiel öffnen
    </EpicButton>
  </EpicCard>
  <EpicButton primary @click="openCreateModal">+ Spiel erstellen</EpicButton>
  <EpicModal v-model:is-open="createModalIsOpen">
    <EpicHeading as="h2" class="mb-6">Neues Spiel erstellen</EpicHeading>
    <form @submit.prevent="createGame">
      <EpicInput v-model="newGame.name" label="Spielname" class="mb-6" />
      <EpicButton primary fullwidth>Spiel erstellen</EpicButton>
    </form>
  </EpicModal>
</template>

<script lang="ts">
import EpicModal from '@components/EpicModal'
import { Game } from '@models/game'
import { defineComponent, ref, unref } from 'vue'
import { storeInstance } from '../store/data-store'
import EpicButton from '@components/EpicButton'
import EpicHeading from '@components/EpicHeading'
import EpicCard from '@components/EpicCard'
import EpicInput from '@components/EpicInput'

export default defineComponent({
  name: 'Games',
  components: {
    EpicButton,
    EpicHeading,
    EpicCard,
    EpicModal,
    EpicInput,
  },
  setup() {
    const games = storeInstance.games
    const newGame = ref(new Game())

    const createModalIsOpen = ref(false)

    function openCreateModal() {
      createModalIsOpen.value = true
    }

    function createGame() {
      storeInstance.addGame(unref(newGame))
      createModalIsOpen.value = false
      newGame.value = new Game()
    }

    return {
      games,
      newGame,
      createModalIsOpen,
      openCreateModal,
      createGame,
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
