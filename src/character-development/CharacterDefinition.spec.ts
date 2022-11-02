import { describe, it, expect } from 'vitest'
import { Character, defineCharacter } from './CharacterDefinition'
import { RevertError } from './Errors'

const characterDefinition = defineCharacter(
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
  },
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
    'purchase-attribute': {
      attributeId: 'group.attribute',
    },
  },
  {
    'add-xp': {
      apply({ amount }, state) {
        // TODO add error handling
        state.rawAttributes.xp += amount
      },
    },
    'purchase-attribute': {
      validate(_, state) {
        if (state.attributes.xp < 5) {
          return 'No no, not xp enough'
        }
        return true
      },
      apply({ attributeId }, state) {
        state.rawAttributes.xp -= 5
        state.rawAttributes[attributeId] += 1
      },
    },
  }
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

  it('persists events', () => {
    const char = new Character(characterDefinition)
    char.execute('add-xp', {
      amount: 20,
    })
    expect(char.history[0]).toEqual({
      id: expect.anything(),
      type: 'add-xp',
      timestamp: expect.anything(),
      payload: {
        amount: 20,
      },
    })
  })

  it('can remove event', () => {
    const char = new Character(characterDefinition)
    char.execute('add-xp', {
      amount: 20,
    })
    const event = char.history[0]
    expect(event).toEqual({
      id: expect.anything(),
      type: 'add-xp',
      timestamp: expect.anything(),
      payload: {
        amount: 20,
      },
    })
    char.revert(event.id)
    expect(char.history).toHaveLength(0)
    expect(char.attributes.xp).toBe(0)
  })

  it('revert keeps other events', () => {
    const char = new Character(characterDefinition)
    char.execute('add-xp', {
      amount: 20,
    })
    char.execute('add-xp', {
      amount: 30,
    })
    const event = char.history[0]
    char.revert(event.id)
    expect(char.history[0]).toEqual({
      id: expect.anything(),
      type: 'add-xp',
      timestamp: expect.anything(),
      payload: {
        amount: 30,
      },
    })
    expect(char.attributes.xp).toBe(30)
  })

  it('cannot revert if history becomes invalid', () => {
    const char = new Character(characterDefinition)
    char.execute('add-xp', {
      amount: 20,
    })
    char.execute('purchase-attribute', {
      attributeId: 'stamina',
    })
    const event = char.history[0]
    char.revert(event.id)
    expect(char.history[0]).toEqual({
      id: expect.anything(),
      type: 'add-xp',
      timestamp: expect.anything(),
      payload: {
        amount: 20,
      },
    })
    expect(char.history[1]).toEqual({
      id: expect.anything(),
      type: 'purchase-attribute',
      timestamp: expect.anything(),
      payload: {
        attributeId: 'stamina',
      },
    })
    expect(char.attributes.xp).toBe(15)
    expect(char.attributes.stamina).toBe(1)
  })

  it('revert yells about validation errors', () => {
    const char = new Character(characterDefinition)
    char.execute('add-xp', {
      amount: 20,
    })
    char.execute('purchase-attribute', {
      attributeId: 'stamina',
    })
    const event = char.history[0]
    const result = char.revert(event.id)
    expect(result).toBeInstanceOf(RevertError)
    if (!(result instanceof RevertError)) {
      return
    }
    const error = result.errors[0]
    expect(error[0]).toBe(char.history[1].id)
    expect(error[1].message).toBe('No no, not xp enough')
  })
})
