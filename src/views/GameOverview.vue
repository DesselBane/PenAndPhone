<template>
  <div class="view-container">
    <EpicHeading class="mb-7 gr-1 heading">Deine Helden</EpicHeading>
    <div class="gr-2">
      <EpicCard class="mb-8 char-card" v-for="char in chars" :key="char.id">
        <EpicHeading as="h3" class="mb-4 gr-1 gcs-1-4">{{
          char.name
        }}</EpicHeading>
        <EpicButton class="gr-2 gc-1" as="router-link" :to="`/char/${char.id}`">
          Übersicht
        </EpicButton>
        <EpicButton
          class="gr-2 gc-2"
          as="router-link"
          :to="`/char/${char.id}/edit`"
          >Editieren
        </EpicButton>
        <EpicButton
          class="gr-2 gc-3"
          as="button"
          @click="() => openDeleteModal(char)"
          icon="delete"
          icononly
          >Löschen
        </EpicButton>
      </EpicCard>
    </div>
    <EpicButton class="gr-3" primary @click="openCreateModal" icon="add">
      Held erstellen
    </EpicButton>
  </div>

  <EpicModal v-model:is-open="createModalIsOpen">
    <EpicHeading as="h2" class="mb-6">Neuen Helden erstellen</EpicHeading>
    <form @submit.prevent="createChar">
      <EpicInput v-model="newChar.name" label="Name" class="mb-6" />
      <EpicButton primary fullwidth>Held erstellen</EpicButton>
    </form>
  </EpicModal>

  <EpicModal v-model:is-open="confirmDeleteModalIsOpen">
    <EpicHeading as="h2" class="mb-6"
      >Soll dieser Held wirklich gelöscht werden?
    </EpicHeading>
    <EpicHeading as="h3" class="mb-4 gr-1 gcs-1-3"
      >Character: {{ deleteCharRef.name }}
    </EpicHeading>
    <EpicButton fullwidth @click="cancleDeleteChar" class="mb-2"
      >Abbrechen
    </EpicButton>
    <EpicButton primary fullwidth @click="deleteChar">Löschen</EpicButton>
  </EpicModal>
</template>

<script lang="ts">
import EpicButton from '@components/EpicButton.vue'
import EpicCard from '@components/EpicCard.vue'
import EpicHeading from '@components/EpicHeading.vue'
import EpicInput from '@components/EpicInput.vue'
import EpicModal from '@components/EpicModal.vue'
import { Character } from '@models/character'
import { Game } from '@models/game'
import { storeInstance } from '@store/data-store'
import { computed } from '@vue/reactivity'
import { defineComponent } from '@vue/runtime-core'
import { ref, unref } from 'vue'
import { useRoute } from 'vue-router'

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
      return storeInstance.getReference(route.params.gameId) as Game | undefined
    })
    const chars = computed(() => unref(game)?.characters)

    // Create Char
    const newChar = ref(new Character())
    const createModalIsOpen = ref(false)
    function openCreateModal() {
      createModalIsOpen.value = true
    }
    function createChar() {
      unref(game).addCharacter(unref(newChar))
      storeInstance.save()
      createModalIsOpen.value = false
      newChar.value = new Character()
    }

    // Delete Char
    const deleteCharRef = ref(new Character(true))
    const confirmDeleteModalIsOpen = ref(false)
    function deleteChar() {
      unref(game).removeCharacter(deleteCharRef.value)
      storeInstance.save()
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
      // CreateChar
      newChar,
      createModalIsOpen,
      createChar,
      openCreateModal,
      //Delete Char
      deleteCharRef,
      confirmDeleteModalIsOpen,
      deleteChar,
      openDeleteModal,
      cancleDeleteChar,
    }
  },
})
</script>
<style lang="scss" scoped>
.view-container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
}

.heading {
  place-self: center;
}

.char-card {
  display: grid;
  grid-template-rows: repeat(2, auto);
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}
</style>
