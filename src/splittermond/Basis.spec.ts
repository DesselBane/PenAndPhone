import { describe, expect, it } from 'vitest'
import { Character } from '../character-development/Character'
import { basisDefinition } from './Basis'

describe('Basis', () => {
  function setupTest() {
    const character = new Character(basisDefinition)

    const getValue = (attribute: keyof typeof character.attributes) =>
      character.getAttribute(attribute).value

    return {
      character,
      getValue,
    }
  }

  it('can set name', () => {
    const { getValue, character } = setupTest()
    character.execute('nameSetzen', {
      name: 'Barbarus',
    })
    expect(getValue('name')).toBe('Barbarus')
  })

  it('can set race', () => {
    const { getValue, character } = setupTest()
    character.execute('rasseSetzen', {
      rasse: 'varg',
    })
    expect(getValue('rasse')).toBe('varg')
  })

  it('can add xp', () => {
    const { getValue, character } = setupTest()
    character.execute('erfahrungspunkteHinzufuegen', {
      menge: 10,
    })
    expect(getValue('erfahrungspunkte')).toBe(10)
  })

  it.each([
    [0, 1],
    [99, 1],
    [100, 2],
    [299, 2],
    [300, 3],
    [599, 3],
    [600, 4],
  ])('for %i used xp hero level is %i', (xp, level) => {
    const { getValue, character } = setupTest()
    character.rawAttributes.erfahrungspunkteEingesetzt = xp
    expect(getValue('heldengrad')).toBe(level)
  })

  it.each([
    [0, 3],
    [100, 4],
    [300, 5],
    [600, 6],
  ])('for %i used xp shard points are %i', (xp, points) => {
    const { getValue, character } = setupTest()
    character.rawAttributes.erfahrungspunkteEingesetzt = xp
    expect(getValue('splitterpunkte')).toBe(points)
  })
})
