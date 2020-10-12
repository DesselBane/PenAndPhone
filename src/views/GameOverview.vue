<template>
  <CList>
    <CListItem v-for="char in chars" :key="char.id">
      {{ char.name }}
    </CListItem>
  </CList>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import { computed } from '@vue/reactivity'
import { storeInstance, createCharMockData } from '../store/data-store'
import CList from '@components/CList'
import CListItem from '@components/CListItem'

export default defineComponent({
  name: 'GameOverview',
  components: {
    CList,
    CListItem,
  },
  setup() {
    const route = useRoute()
    const selectedGame = computed(() => {
      return storeInstance.games.value.find(
        (x) => x.id === Number(route.params.gameId)
      )
    })

    console.log(selectedGame.value)

    createCharMockData(Number(route.params.gameId))

    return {
      chars: selectedGame.value?.characters,
    }
  },
})
</script>

<style scoped></style>
