<template>
  <div class="v-games">
    <EpicHeading class="mb-7 heading">Deine Spiele</EpicHeading>
    <div>
      <EpicCard class="mb-8 game-card" v-for="game in games" :key="game.id">
        <EpicHeading as="h3" class="mb-4 gr-1 gcs-1-3 ">{{
          game.name
        }}</EpicHeading>
        <EpicButton
          class="gr-3 gc-1"
          as="router-link"
          :to="`/game/${game.id}/overview`"
          >Spiel öffnen
        </EpicButton>

        <EpicButton
          class="gr-3 gc-2"
          as="button"
          @click="() => openDeleteModal(game)"
          >Spiel löschen
        </EpicButton>
      </EpicCard>
    </div>
    <EpicButton primary @click="openCreateModal">Spiel erstellen</EpicButton>
    <EpicModal v-model:is-open="createModalIsOpen">
      <EpicHeading as="h2" class="mb-6">Neues Spiel erstellen</EpicHeading>
      <form @submit.prevent="createGame">
        <EpicInput v-model="newGame.name" label="Spielname" class="mb-6" />
        <EpicButton primary fullwidth>Spiel erstellen</EpicButton>
      </form>
    </EpicModal>

    <EpicModal v-model:is-open="confirmDeleteModalIsOpen">
      <EpicHeading as="h2" class="mb-6"
        >Soll dieses Spiel wirklich gelöscht werden?</EpicHeading
      >
      <EpicHeading as="h3" class="mb-4 gr-1 gcs-1-3 "
        >Spiel: {{ deleteGameRef.name }}
      </EpicHeading>
      <EpicButton fullwidth @click="cancleDeleteGame">Abbrechen</EpicButton>
      <EpicButton primary fullwidth @click="deleteGame">Löschen</EpicButton>
    </EpicModal>
  </div>
</template>

<script lang="ts">
import EpicModal from '@components/EpicModal'
import { Game } from '@models/game'
import { defineComponent, Ref, ref, unref } from 'vue'
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
    const confirmDeleteModalIsOpen = ref(false)
    const deleteGameRef: Ref<Game> = ref(new Game())

    function openCreateModal() {
      createModalIsOpen.value = true
    }

    function createGame() {
      storeInstance.addGame(unref(newGame))
      createModalIsOpen.value = false
      newGame.value = new Game()
    }

    function deleteGame() {
      storeInstance.removeGame(deleteGameRef.value)
      deleteGameRef.value = new Game()
      confirmDeleteModalIsOpen.value = false
    }

    function openDeleteModal(game: Game) {
      deleteGameRef.value = game
      confirmDeleteModalIsOpen.value = true
    }

    function cancleDeleteGame() {
      deleteGameRef.value = new Game()
      confirmDeleteModalIsOpen.value = false
    }

    return {
      games,
      newGame,
      createModalIsOpen,
      deleteGame,
      openCreateModal,
      createGame,
      confirmDeleteModalIsOpen,
      deleteGameRef,
      openDeleteModal,
      cancleDeleteGame,
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

<style scoped>
.v-games {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.heading {
  place-self: center;
}

.game-card {
  display: grid;
  grid-template-rows: repeat(3, auto);
  grid-template-columns: 1fr 1fr;
}
</style>
