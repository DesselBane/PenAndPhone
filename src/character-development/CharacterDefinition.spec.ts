import { describe, it, expect } from 'vitest'
import {
  Character,
  defineCharacter,
  defineCharacterAttributes,
} from './CharacterDefinition'

const attributesDefinition = defineCharacterAttributes(
  {
    xp: { type: 'number' },
    name: { type: 'text' },
    intelligence: { type: 'number' },
    stamina: { type: 'number' },
    climbing: { type: 'number' },
    size: { type: 'number' },
    speed: { type: 'number' },
    race: {
      type: 'single-select',
      options: ['human', 'warg'] as const,
    },
  },
  {
    basic: ['xp', 'name', 'race'],
    attribute: ['intelligence', 'stamina'],
    derived: ['speed'],
    abilities: ['climbing'],
  }
)
const characterDefinition = defineCharacter(
  attributesDefinition.attributes,
  attributesDefinition.groups,
  {
    climbing: (currentState) => {
      const { rawAttributes, attributes } = currentState
      return (
        attributes.intelligence + attributes.stamina + rawAttributes.climbing
      )
    },
    size: ({ attributes }) => {
      return attributes.race === 'warg' ? 5 : 4
    },
    speed: ({ attributes, rawAttributes }) => {
      return attributes.size + rawAttributes.speed
    },
  },
  {
    'add-xp': {
      amount: 'number',
    },
  },
  {
    'add-xp': ({ amount }, state) => {
      // TODO add error handling
      state.rawAttributes.xp += amount
    },
  }

  /*  [
    {
      id: 'add-xp',
      payload: {
        amount: 'number',
      },
    },
    {
      id: 'purchase-attribute',
      resolve(
        payload: {
          attributeId?: typeof attributesDefinition.groups['attribute'][number]
        },
        state
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
  ] as const,*/
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

  it('add xp', () => {
    const char = new Character(characterDefinition)

    char.rawAttributes.xp = 0
    expect(char.attributes.xp).toBe(0)

    char.execute('add-xp', {
      amount: 10,
    })

    expect(char.attributes.xp).toBe(10)
  })

  /*  it('can purchase attribute', () => {
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
  })*/
})
