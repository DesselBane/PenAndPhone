<script setup lang="ts">
import { useAuth } from '@vueuse/firebase'
import { computed, ref, unref } from 'vue'
import { useCharacterStore } from './store/CharacterStore'
import { initializeApp } from 'firebase/app'
import {
  ref as fbRef,
  getStorage,
  uploadString,
  getBytes,
} from 'firebase/storage'
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth'

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

const firebaseConfig = {
  apiKey: 'AIzaSyApIDtWXZ_J8uHjwDaNWULCvxfK1eAvfEE',
  authDomain: 'penandphone-364415.firebaseapp.com',
  projectId: 'penandphone-364415',
  storageBucket: 'penandphone-364415.appspot.com',
  messagingSenderId: '853355927149',
  appId: '1:853355927149:web:c2caae1ec6ee8ffe50d164',
  measurementId: 'G-DMT7KBPHQ5',
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const { isAuthenticated, user } = useAuth(auth)

const storage = getStorage()
const myRef = computed(() => {
  const userLocal = unref(user)

  if (userLocal == null) {
    return null
  }

  return fbRef(storage, `${userLocal.uid}/chars.json`)
})

const data = ref('')
const isStorageActive = ref(false)
async function saveData() {
  const dataRef = unref(myRef)

  if (unref(isStorageActive) || dataRef == null) {
    return
  }

  isStorageActive.value = true
  try {
    const fileData =
      `${new Date().toString()} | ${user.value?.displayName}` ?? ''

    await uploadString(dataRef, fileData)
  } finally {
    isStorageActive.value = false
  }
}

async function loadData() {
  const dataRef = unref(myRef)

  if (unref(isStorageActive) || dataRef == null) {
    return
  }
  isStorageActive.value = true

  try {
    const bytes = await getBytes(dataRef)
    data.value = new TextDecoder().decode(bytes)
  } finally {
    isStorageActive.value = false
  }
}

const login = () => signInWithPopup(auth, new GoogleAuthProvider())
const logout = () => signOut(auth)

async function doWork() {
  const char = charStore.create()
  await wait()
  char.name = 'foo'
  await wait()
  char.addExp(20)
  await wait()
  char.purchase('agility')
  char.purchase('constitution')
}
</script>

<template>
  <h1>All Chars</h1>
  <p>{{ allChars }}</p>
  <div>
    <p>isAuthenticated: {{ isAuthenticated }}</p>
    <p>data: {{ data }}</p>
  </div>
  <button @click="doWork">Do work</button>
  <button v-if="!isAuthenticated" @click="login">Login</button>
  <button v-else @click="logout">Logout</button>
  <button :disabled="isStorageActive" @click="saveData">Save</button>
  <button :disabled="isStorageActive" @click="loadData">Load</button>
</template>

<style scoped></style>
