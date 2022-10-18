import { describe, it, expect } from 'vitest'
import {
  Character,
  CharacterDefinition,
  CharacterRules,
} from './CharacterDefinition'

const characterDefinition = new CharacterDefinition({
  attributeDefinitions: [
    { id: 'xp', type: 'number' },
    { id: 'name', type: 'text' },
    { id: 'intelligence', type: 'number' },
    { id: 'stamina', type: 'number' },
    { id: 'climbing', type: 'number' },
    { id: 'size', type: 'number' },
    {
      id: 'race',
      type: 'single-select',
      options: ['human', 'warg'],
    },
  ],
} as const)

const charRules = new CharacterRules({
  characterDefinition,
  attributeCalculations: [
    {
      attributeId: 'climbing',
      calculation(state) {
        return state.intelligence + state.stamina + state.climbing
      },
    },
    {
      attributeId: 'size',
      calculation(state) {
        return state.race === 'warg' ? 5 : 4
      },
    },
  ],
})

describe('CharacterDefinition', () => {
  it('can calculate attributes', () => {
    const char = new Character(characterDefinition, charRules)
    char.state.intelligence = 10
    char.state.stamina = 5
    expect(char.state.climbing).toBe(15)
    char.state.climbing = 5
    expect(char.state.climbing).toBe(20)
  })

  it('respects race', () => {
    const char = new Character(characterDefinition, charRules)
    char.state.race = 'warg'
    expect(char.state.size).toBe(5)
    char.state.race = 'human'
    expect(char.state.size).toBe(4)
  })
})
