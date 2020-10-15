<template>
  <CList>
    <CListItem v-for="char in chars" :key="char.id">
      {{ char.name }}
    </CListItem>
    <CListItem>
      <EpicButton @click="handleAddChar">+</EpicButton>
    </CListItem>
  </CList>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity'
import { defineComponent } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { storeInstance } from '../store/data-store'
import CList from '@components/CList'
import CListItem from '@components/CListItem'
import { Character } from '@models/character'
import EpicButton from '@components/EpicButton'

export default defineComponent({
  name: 'GameOverview',
  components: {
    CList,
    CListItem,
    EpicButton,
  },
  setup() {
    const route = useRoute()
    const selectedChars = computed(() => {
      return storeInstance.games.value.find(
        (x) => x.id === Number(route.params.gameId)
      )?.characters
    })

    const handleAddChar = () => {
      const char = new Character()
      char.name = 'Bar'
      storeInstance.games.value
        .find((x) => x.id === Number(route.params.gameId))
        .characters.push(char)
    }

    return {
      chars: selectedChars,
      handleAddChar,
    }
  },
})
</script>

<style scoped></style>
