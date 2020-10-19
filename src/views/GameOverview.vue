<template>
  <EpicHeading class="mb-7">Deine Helden</EpicHeading>
  <EpicCard class="mb-8" v-for="char in chars" :key="char.id">
    <EpicHeading as="h3" class="mb-4">{{ char.name }}</EpicHeading>
    <EpicButton
      class="gr-3 gc-1"
      as="router-link"
      :to="`/game/${game.id}/char/${char.id}/edit`"
      >Editieren
    </EpicButton>
    <EpicButton
      class="gr-3 gc-2"
      as="button"
      @click="() => openDeleteModal(char)"
      icon="delete"
      icononly
      >Löschen
    </EpicButton>
  </EpicCard>
  <EpicButton primary @click="openCreateModal" icon="add">
    Held erstellen
  </EpicButton>
  <EpicModal v-model:is-open="createModalIsOpen">
    <EpicHeading as="h2" class="mb-6">Neuen Helden erstellen</EpicHeading>
    <form @submit.prevent="createChar">
      <EpicInput v-model="newChar.name" label="Spielname" class="mb-6" />
      <EpicButton primary fullwidth>Held erstellen</EpicButton>
    </form>
  </EpicModal>

  <EpicModal v-model:is-open="confirmDeleteModalIsOpen">
    <EpicHeading as="h2" class="mb-6"
      >Soll dieser Held wirklich gelöscht werden?
    </EpicHeading>
    <EpicHeading as="h3" class="mb-4 gr-1 gcs-1-3 "
      >Character: {{ deleteCharRef.name }}
    </EpicHeading>
    <EpicButton fullwidth @click="cancleDeleteChar" class="mb-2"
      >Abbrechen
    </EpicButton>
    <EpicButton primary fullwidth @click="deleteChar">Löschen</EpicButton>
  </EpicModal>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity'
import { defineComponent } from '@vue/runtime-core'
import { ref, unref } from 'vue'
import { useRoute } from 'vue-router'
import { storeInstance } from '../store/data-store'
import { Character } from '@models/character'
import EpicModal from '@components/EpicModal'
import EpicButton from '@components/EpicButton'
import EpicHeading from '@components/EpicHeading'
import EpicCard from '@components/EpicCard'
import EpicInput from '@components/EpicInput'

export default defineComponent({
  name: 'GameOverview',
  components: {
    EpicButton,
    EpicHeading,
    EpicCard,
    EpicModal,
    EpicInput,
  },
  setup() {
    const route = useRoute()
    const game = computed(() => {
      return storeInstance.getGameById(Number(route.params.gameId))
    })
    const chars = game.value.characters
    const newChar = ref(new Character())
    const deleteCharRef = ref(new Character(true))
    const confirmDeleteModalIsOpen = ref(false)

    const createModalIsOpen = ref(false)

    function openCreateModal() {
      createModalIsOpen.value = true
    }

    function createChar() {
      game.value.addCharacter(unref(newChar))
      createModalIsOpen.value = false
      newChar.value = new Character()
    }

    function deleteChar() {
      game.value.removeCharacter(deleteCharRef.value)
      deleteCharRef.value = new Character()
      confirmDeleteModalIsOpen.value = false
    }

    function openDeleteModal(char: Character) {
      deleteCharRef.value = char
      confirmDeleteModalIsOpen.value = true
    }

    function cancleDeleteChar() {
      deleteCharRef.value = new Character()
      confirmDeleteModalIsOpen.value = false
    }

    return {
      game,
      chars,
      newChar,
      createChar,
      openCreateModal,
      createModalIsOpen,
      deleteChar,
      openDeleteModal,
      cancleDeleteChar,
      deleteCharRef,
      confirmDeleteModalIsOpen,
    }
  },
})
</script>
