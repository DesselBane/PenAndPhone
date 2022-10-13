import { Character } from './Character'
import { describe, it, expect } from 'vitest'

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

  it('can purchase agility', () => {
    const character = new Character()
    character.addExp(30)
    character.purchaseAgility()
    expect(character.agility).toEqual(1)
  })

  it('cannot purchase agility without exp', () => {
    const character = new Character()
    character.purchaseAgility()
    expect(character.agility).toEqual(0)
  })
})
