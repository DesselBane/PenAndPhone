import { defineStore } from 'pinia'
import { ref, unref, UnwrapRef } from 'vue'
import { AuthError } from '../errors/AuthError'
import { Character } from '../models/Character'
import { useFirebase } from './Firebase'
import {
  getDocs,
  query,
  where,
  collection,
  getFirestore,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore'

export interface CharBackendData {
  id: string
  ownerId: string
}

export const useCharacterStore = defineStore('character-data', () => {
  const characters = ref<Character[]>([])

  function create(): UnwrapRef<Character> {
    const newChar = new Character()
    unref(characters).push(newChar)

    return unref(characters).find((x) => x.id === newChar.id)!
  }

  async function loadCharacters() {
    const { isAuthenticated, user } = useFirebase()
    if (!unref(isAuthenticated) || user == null) {
      return new AuthError('User is not authenticated')
    }

    const db = getFirestore()
    const chars = collection(db, 'characters')
    const myCharsQuery = query(chars, where('ownerId', '==', user.uid))
    const charSnapshots = await getDocs(myCharsQuery)

    const snaps: QueryDocumentSnapshot<DocumentData>[] = []

    charSnapshots.forEach((x) => {
      snaps.push(x)
    })

    const results: unknown[] = []
    for (const snapshot of snaps) {
      const data = snapshot.data()
      const events: unknown[] = []

      const eventSnapshots = await getDocs(collection(snapshot.ref, 'events'))

      eventSnapshots.forEach((x) => {
        events.push(x.data())
      })

      data.events = events

      results.push(data)
    }

    return results
  }

  return { characters, create, loadCharacters }
})
