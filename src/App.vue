<script setup lang="ts">
import { computed } from 'vue'
import { useCharacterStore } from './store/CharacterStore'

const charStore = useCharacterStore()

const allChars = computed(() => {
  return JSON.stringify(charStore.characters, null, '\t')
})

const wait = (millis: number = 1000) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log('next')
      resolve()
    }, millis)
  })
}

async function doWork() {
  const char = charStore.create()
  await wait()
  char.name = 'foo'
  await wait()
  char.addExp(20)
  await wait()
  char.purchaseAgility()
}
</script>

<template>
  <h1>All Chars</h1>
  <p>{{ allChars }}</p>
  <button @click="doWork">Do work</button>
</template>

<style scoped></style>
