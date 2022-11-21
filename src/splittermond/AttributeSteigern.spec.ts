import { describe, expect, it } from 'vitest'
import { Character } from '../character-development/Character'
import { attribute } from './Attribute'
import { attributeSteigernDefinition } from './AttributeSteigern'

describe('AttributeSteigern', () => {
  function setupTest(initialPoints = 10) {
    const character = new Character(attributeSteigernDefinition)
    character.rawAttributes.attributPunkte = initialPoints

    const execute = (attribut: typeof attribute[number] = 'ausstrahlung') =>
      character.execute('attributSteigernMitPunkt', {
        attribut,
      })

    const getValue = (
      attribute: keyof typeof character.attributes = 'ausstrahlung'
    ) => character.getAttribute(attribute).rawValue

    return {
      character,
      execute,
      getValue,
    }
  }

  it('fails without enough points', () => {
    const { getValue, execute } = setupTest(0)
    expect(execute()).toBeInstanceOf(Error)
    expect(getValue()).toBe(0)
  })

  it('works with enough points', () => {
    const { getValue, execute } = setupTest(1)
    expect(execute()).not.toBeInstanceOf(Error)
    expect(getValue()).toBe(1)
  })

  it('removes points', () => {
    const { getValue, execute } = setupTest(1)
    execute()
    expect(getValue('attributPunkte')).toBe(0)
  })

  it('fails when reached maximum', () => {
    const { getValue, execute } = setupTest()
    execute()
    execute()
    execute()
    execute()
    expect(execute()).toBeInstanceOf(Error)
    expect(getValue()).toBe(4)
  })

  it.each(attribute)('works for attribute "%s"', (attribut) => {
    const { getValue, execute } = setupTest()
    execute(attribut)
    execute(attribut)
    expect(getValue(attribut)).toBe(2)
  })

  it('maximum for second attribute is 3', () => {
    const { getValue, execute } = setupTest()
    execute()
    execute()
    execute()
    execute()

    execute('intuition')
    execute('intuition')
    execute('intuition')

    expect(execute('intuition')).toBeInstanceOf(Error)
    expect(getValue('intuition')).toBe(3)
  })

  it('maximum for second attribute is 4 for humans', () => {
    const { character, getValue, execute } = setupTest()
    character.rawAttributes.rasse = 'mensch'
    execute()
    execute()
    execute()
    execute()

    execute('intuition')
    execute('intuition')
    execute('intuition')
    execute('intuition')

    expect(execute('intuition')).toBeInstanceOf(Error)
    expect(getValue('intuition')).toBe(4)
  })

  it('maximum for strength is 3 for vargs', () => {
    const { character, getValue, execute } = setupTest()
    character.rawAttributes.rasse = 'varg'
    execute('staerke')
    execute('staerke')
    execute('staerke')
    expect(execute('staerke')).toBeInstanceOf(Error)
    expect(getValue('staerke')).toBe(3)
  })
})
