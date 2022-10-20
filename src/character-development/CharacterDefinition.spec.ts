import { describe, it, expect } from 'vitest'
import { Character, createCharacterDefinition } from './CharacterDefinition'

const characterDefinition = createCharacterDefinition({
  attributes: [
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
} as const)({
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
  events: [
    {
      id: 'add-xp',
      resolve(payload: Readonly<{ amount?: number }>, state) {
        if (payload.amount == null) {
          return
        }
        state.xp += payload.amount
      },
    },
    {
      id: 'purchase-attribute',
      resolve(payload, state) {
        if (state.xp < 5) {
          return
        }
        state[
          payload.attributeId as typeof characterDefinition.attributes[number]['id']
        ]++
      },
    },
  ],
} as const)

describe('CharacterDefinition', () => {
  it('can calculate attributes', () => {
    const char = new Character(characterDefinition)
    char.state.intelligence = 10
    char.state.stamina = 5
    expect(char.state.climbing).toBe(15)
    char.state.climbing = 5
    expect(char.state.climbing).toBe(20)
  })

  it('respects race', () => {
    const char = new Character(characterDefinition)
    char.state.race = 'warg'
    expect(char.state.size).toBe(5)
    char.state.race = 'human'
    expect(char.state.size).toBe(4)
  })

  it('can purchase attribute', () => {
    const char = new Character(characterDefinition)
    char.execute('purchase-attribute', {
      attributeId: 'stamina',
    })
    expect(char.state.stamina).toBe(0)
    char.execute('add-xp', {
      amount: 20,
    })
    char.execute('purchase-attribute', {
      attributeId: 'stamina',
    })
    expect(char.state.stamina).toBe(1)
  })
})
