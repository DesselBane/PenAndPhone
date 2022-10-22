<script setup lang="ts">
import { isDefined } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref, unref } from 'vue'
import { AuthError } from './errors/AuthError'
import { useCharacterStore } from './store/CharacterStore'
import { useFirebase } from './store/Firebase'

const { create, loadCharacters } = useCharacterStore()
const { user, isAuthenticated } = storeToRefs(useFirebase())
const { logout, login } = useFirebase()

const username = computed(() => {
  if (!isDefined(user)) {
    return ''
  }

  return `${unref(user).displayName} - ${unref(user).uid}`
})

const allChars = ref<unknown>([])

async function load() {
  const maybeChars = await loadCharacters()

  if (maybeChars instanceof AuthError) {
    console.error(maybeChars.message)
    return
  }

  allChars.value = maybeChars
}

const wait = (millis: number = 1000) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log('next')
      resolve()
    }, millis)
  })
}

async function doWork() {
  const char = create()
  await wait()
  char.name = 'foo'
  await wait()
  char.addExp(20)
  await wait()
  char.purchaseAgility()
}
</script>

<template>
  <div>
    <h1>User</h1>
    <p>isAuthenticated: {{ isAuthenticated }}</p>
    <p>User: {{ username }}</p>
  </div>
  <h1>All Chars</h1>
  <p>{{ allChars }}</p>
  <button @click="doWork">Do work</button>
  <button v-if="!isAuthenticated" @click="login">Login</button>
  <button v-else @click="logout">Logout</button>
  <button v-if="isAuthenticated" @click="load">Load</button>
</template>

<style scoped></style>
