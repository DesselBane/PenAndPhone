import { Character } from './Character'
import { describe, it, expect } from 'vitest'
import { AttributeKey } from './Attribute'

describe('Character', () => {
  it('can change name', () => {
    const character = new Character()
    const name = 'Drogon'
    character.name = name
    expect(character.name).toEqual(name)
  })

  it('can add exp', () => {
    const character = new Character()
    const exp = 30
    character.addExp(exp)
    expect(character.totalExp).toEqual(exp)
  })

  describe.each(['agility', 'constitution'] as AttributeKey[])(
    'attribute "%s"',
    (attribute) => {
      it(`can purchase`, () => {
        const character = new Character()
        character.addExp(30)
        character.purchase(attribute)
        expect(character[attribute]).toEqual(1)
      })

      it(`cannot purchase without exp`, () => {
        const character = new Character()
        character.purchase(attribute)
        expect(character[attribute]).toEqual(0)
      })
    }
  )
})
