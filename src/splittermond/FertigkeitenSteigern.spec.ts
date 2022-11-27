import { describe, it } from 'vitest'
import { createTestSetup } from '../character-development/Testutils'
import { fertigkeitenSteigernDefinition } from './FertigkeitenSteigern'

describe('FertigkeitenSteigern', () => {
  const { setupTest: generalSetupTest } = createTestSetup(
    fertigkeitenSteigernDefinition
  )

  function setupTest(...args: Parameters<typeof generalSetupTest>) {
    const { expectState, character } = generalSetupTest(...args)

    function increase() {
      character.execute('fertigkeitSteigern', {
        fertigkeit: 'bann',
      })
    }

    return {
      expectState,
      increase,
    }
  }

  it('can not increase without points or xp', () => {
    const { expectState, increase } = setupTest()
    increase()
    expectState({
      bann: 0,
    })
  })

  it('can increase with points', () => {
    const { expectState, increase } = setupTest({
      freieFertigkeitsPunkte: 1,
    })
    increase()
    expectState({
      bann: 1,
      freieFertigkeitsPunkte: 0,
    })
  })

  it('can increase with xp', () => {
    const { expectState, increase } = setupTest({
      erfahrungspunkte: 10,
    })
    increase()
    expectState({
      bann: 1,
      erfahrungspunkteEingesetzt: 3,
    })
  })

  it('calculates xp cost for skill level', () => {
    const { expectState, increase } = setupTest({
      erfahrungspunkte: 110,
      erfahrungspunkteEingesetzt: 100,
      bann: 6,
    })
    increase()
    expectState({
      bann: 7,
      erfahrungspunkteEingesetzt: 105,
    })
  })
})
