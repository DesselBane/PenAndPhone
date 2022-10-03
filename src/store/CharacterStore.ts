import { defineStore } from 'pinia'
import { ref, unref, UnwrapRef } from 'vue'
import { Character } from '../models/Character'

export const useCharacterStore = defineStore('character-data', () => {
  const characters = ref<Character[]>([])

  function create(): UnwrapRef<Character> {
    const newChar = new Character()
    unref(characters).push(newChar)

    return unref(characters).find((x) => x.id === newChar.id)!
  }

  return { characters, create }
})
