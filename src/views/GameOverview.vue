<template>
  <EpicHeading class="mb-7">Deine Helden</EpicHeading>
  <EpicCard class="mb-8" v-for="{ id, name } in chars" :key="id">
    <EpicHeading as="h3" class="mb-4">{{ name }}</EpicHeading>
  </EpicCard>
  <EpicButton primary @click="openCreateModal" icon="add">
    Helden erstellen
  </EpicButton>
  <EpicModal v-model:is-open="createModalIsOpen">
    <EpicHeading as="h2" class="mb-6">Neuen Helden erstellen</EpicHeading>
    <form @submit.prevent="createChar">
      <EpicInput v-model="newChar.name" label="Spielname" class="mb-6" />
      <EpicButton primary fullwidth>Held erstellen</EpicButton>
    </form>
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
      return storeInstance.games.value.find(
        (x) => x.id === Number(route.params.gameId)
      )
    })
    const chars = game.value.characters
    const newChar = ref(new Character())

    const createModalIsOpen = ref(false)

    function openCreateModal() {
      createModalIsOpen.value = true
    }

    function createChar() {
      game.value.addCharacter(unref(newChar))
      createModalIsOpen.value = false
      newChar.value = new Character()
    }

    return {
      chars,
      newChar,
      createChar,
      openCreateModal,
      createModalIsOpen,
    }
  },
})
</script>

<style scoped></style>
