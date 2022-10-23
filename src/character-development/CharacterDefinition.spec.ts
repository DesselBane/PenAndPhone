import { describe, it, expect } from 'vitest'
import { Character, createCharacterDefinition } from './CharacterDefinition'

const characterDefinition = createCharacterDefinition(
  [
    { id: 'xp', type: 'number' },
    { id: 'name', type: 'text' },
    { id: 'intelligence', type: 'number' },
    { id: 'stamina', type: 'number' },
    { id: 'climbing', type: 'number' },
    { id: 'size', type: 'number' },
    { id: 'speed', type: 'number' },
    {
      id: 'race',
      type: 'single-select',
      options: ['human', 'warg'],
    },
  ] as const,
  {
    basic: ['xp', 'name', 'race'],
    attribute: ['intelligence', 'stamina'],
    derived: ['speed'],
    abilities: ['climbing'],
  } as const,
  [
    {
      attributeId: 'climbing',
      calculation({ rawAttributes, attributes }) {
        return (
          attributes.intelligence + attributes.stamina + rawAttributes.climbing
        )
      },
    },
    {
      attributeId: 'size',
      calculation({ attributes }) {
        return attributes.race === 'warg' ? 5 : 4
      },
    },
    {
      attributeId: 'speed',
      calculation({ attributes, rawAttributes }) {
        return attributes.size + rawAttributes.speed
      },
    },
  ] as const,
  [
    {
      id: 'add-xp',
      resolve(payload: { amount?: number }, state) {
        if (payload.amount == null) {
          return
        }
        state.rawAttributes.xp += payload.amount
      },
    },
    {
      id: 'purchase-attribute',
      resolve(
        payload: {
          attributeId?: typeof attributeGroupDefinitions['attribute'][number]
        },
        state,
        attributeDefintitions,
        attributeGroupDefinitions
      ) {
        if (payload.attributeId == null) {
          return
        }
        if (state.attributes.xp < 5) {
          return
        }
        state.rawAttributes[payload.attributeId]++
      },
    },
  ] as const
)

describe('CharacterDefinition', () => {
  it('can calculate attributes', () => {
    const char = new Character(characterDefinition)
    char.rawAttributes.intelligence = 10
    char.rawAttributes.stamina = 5
    expect(char.attributes.climbing).toBe(15)
    char.rawAttributes.climbing = 5
    expect(char.attributes.climbing).toBe(20)
  })

  it('can calculate attributes', () => {
    const char = new Character(characterDefinition)
    char.rawAttributes.race = 'warg'
    expect(char.attributes.speed).toBe(5)
    char.rawAttributes.race = 'human'
    expect(char.attributes.speed).toBe(4)
    char.rawAttributes.speed = 5
    expect(char.attributes.speed).toBe(9)
  })

  it('respects race', () => {
    const char = new Character(characterDefinition)
    char.rawAttributes.race = 'warg'
    expect(char.attributes.size).toBe(5)
    char.rawAttributes.race = 'human'
    expect(char.attributes.size).toBe(4)
  })

  it('can purchase attribute', () => {
    const char = new Character(characterDefinition)
    char.execute('purchase-attribute', {
      attributeId: 'stamina',
    })
    expect(char.attributes.stamina).toBe(0)
    char.execute('add-xp', {
      amount: 20,
    })
    char.execute('purchase-attribute', {
      attributeId: 'stamina',
    })
    expect(char.attributes.stamina).toBe(1)
  })
})
