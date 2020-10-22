<template>
  <div>
    <EpicHeading class="mb-7">Brandur Boraldin</EpicHeading>
    <EpicCard class="mb-8" v-for="{ id, name } in games" :key="id">
      <EpicHeading as="h3" class="mb-6">{{ name }}</EpicHeading>
      <EpicAttributeInput label="Stärke" :modelValue="2" class="mb-6" />
      <EpicAttributeInput label="Ausdauer" :modelValue="3" class="mb-6" />
      <EpicAttributeInput label="Willenskraft" :modelValue="1" class="mb-6" />
      <EpicButton as="router-link" :to="`/game/${id}`">Speichern</EpicButton>
    </EpicCard>
    <EpicButton primary @click="openCreateModal">+ Spiel erstellen</EpicButton>
    <EpicModal v-model:is-open="createModalIsOpen">
      <EpicHeading as="h2" class="mb-6">Neues Spiel erstellen</EpicHeading>
      <form @submit.prevent="createGame">
        <EpicInput modelValue="" label="Spielname" class="mb-6" />
        <EpicButton primary fullwidth>Spiel erstellen</EpicButton>
      </form>
    </EpicModal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import EpicCard from '@components/EpicCard.vue'
import EpicHeading from '@components/EpicHeading.vue'
import EpicButton from '@components/EpicButton.vue'
import EpicModal from '@components/EpicModal.vue'
import EpicInput from '@components/EpicInput.vue'
import EpicAttributeInput from '@components/EpicAttributeInput.vue'

export default defineComponent({
  name: 'Playground',
  components: {
    EpicCard,
    EpicHeading,
    EpicButton,
    EpicModal,
    EpicInput,
    EpicAttributeInput,
  },
  setup() {
    const games = ref([
      {
        id: '1',
        name: 'Attribute',
      },
      {
        id: '2',
        name: 'Dragonland Witch Hunt',
      },
    ])

    const createModalIsOpen = ref(false)
    function openCreateModal() {
      createModalIsOpen.value = true
    }

    function createGame() {
      // Create da epic game HEEEERRREEE
      createModalIsOpen.value = false
    }

    return {
      games,
      createModalIsOpen,
      openCreateModal,
      createGame,
    }
  },
})
</script>
