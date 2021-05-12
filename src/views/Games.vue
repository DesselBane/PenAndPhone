<template>
  <div class="view-container">
    <EpicHeading class="mb-7 heading gr-1">Deine Spiele</EpicHeading>
    <div class="gr-2">
      <EpicCard class="mb-8 game-card" v-for="game in games" :key="game.id">
        <EpicHeading as="h3" class="mb-4 gr-1 gcs-1-3"
          >{{ game.name }}
        </EpicHeading>
        <EpicButton class="gr-2 gc-1" as="router-link" :to="`/game/${game.id}`"
          >Öffnen
        </EpicButton>
        <EpicButton
          class="gr-2 gc-2"
          as="button"
          @click="() => openDeleteModal(game)"
          icon="delete"
          icononly
          >Spiel löschen
        </EpicButton>
      </EpicCard>
    </div>
    <EpicButton class="gr-3" primary @click="openCreateModal" icon="add">
      Spiel erstellen
    </EpicButton>
  </div>

  <EpicModal v-model:is-open="createModalIsOpen">
    <EpicHeading as="h2" class="mb-6">Neues Spiel erstellen</EpicHeading>
    <form @submit.prevent="createGame">
      <EpicInput v-model="newGame.name" label="Spielname" class="mb-4" />
      <EpicButton primary fullwidth>Spiel erstellen</EpicButton>
    </form>
  </EpicModal>
  <EpicModal v-model:is-open="confirmDeleteModalIsOpen">
    <EpicHeading as="h2" class="mb-6"
      >Soll dieses Spiel wirklich gelöscht werden?</EpicHeading
    >
    <EpicHeading as="h3" class="mb-4 gr-1 gcs-1-3"
      >Spiel: {{ deleteGameRef.name }}
    </EpicHeading>
    <EpicButton fullwidth @click="cancleDeleteGame" class="mb-2"
      >Abbrechen</EpicButton
    >
    <EpicButton primary fullwidth @click="deleteGame">Löschen</EpicButton>
  </EpicModal>
</template>

<script lang="ts">
import EpicButton from '@components/EpicButton.vue'
import EpicCard from '@components/EpicCard.vue'
import EpicHeading from '@components/EpicHeading.vue'
import EpicInput from '@components/EpicInput.vue'
import EpicModal from '@components/EpicModal.vue'
import { Game } from '@models/game'
import { storeInstance } from '@store/data-store'
import { defineComponent, ref, unref } from 'vue'

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

    // Create Game
    const newGame = ref(new Game())
    const createModalIsOpen = ref(false)
    function openCreateModal() {
      createModalIsOpen.value = true
    }
    function createGame() {
      storeInstance.addGame(unref(newGame))
      storeInstance.save()
      createModalIsOpen.value = false
      newGame.value = new Game()
    }

    // Delete Game
    const confirmDeleteModalIsOpen = ref(false)
    const deleteGameRef = ref(new Game())
    function deleteGame() {
      storeInstance.removeGame(deleteGameRef.value)
      storeInstance.save()
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
      // Create Game
      newGame,
      createModalIsOpen,
      openCreateModal,
      createGame,
      // Delete Game
      confirmDeleteModalIsOpen,
      deleteGameRef,
      deleteGame,
      openDeleteModal,
      cancleDeleteGame,
    }
  },
})
</script>

<style scoped>
.view-container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
}

.heading {
  place-self: center;
}

.game-card {
  display: grid;
  grid-template-rows: repeat(2, auto);
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}
</style>
