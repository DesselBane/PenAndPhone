import { describe, it } from 'vitest'
import { createTestSetup } from '../character-development/Testutils'
import { abgeleiteteWerteDefinition } from './AbgeleiteteWerte'

describe('AbgeleiteteWerte', () => {
  const { setupTest } = createTestSetup(abgeleiteteWerteDefinition)

  it.each([
    ['alb', 5],
    ['gnom', 3],
    ['mensch', 5],
    ['varg', 6],
    ['zwerg', 4],
  ] as const)('for race "%s" size class is %i', (race, sizeClass) => {
    const { expectState } = setupTest({
      rasse: race,
    })
    expectState({
      groessenklasse: sizeClass,
    })
  })

  it.each([
    ['alb', 0, 6],
    ['alb', 2, 8],
    ['gnom', 0, 3],
    ['gnom', 4, 7],
    ['zwerg', 4, 7],
  ] as const)(
    'for race "%s" and agility %i speed is %i',
    (race, agility, speed) => {
      const { expectState } = setupTest({
        rasse: race,
        beweglichkeit: agility,
      })
      expectState({
        geschwindigkeit: speed,
      })
    }
  )

  it('initiative is calculated correctly', () => {
    const { expectState } = setupTest({
      intuition: 7,
    })
    expectState({
      initiative: 3,
    })
  })

  it('health is calculated correctly', () => {
    const { expectState } = setupTest({
      konstitution: 4,
      rasse: 'alb',
    })
    expectState({
      lebenspunkte: 9,
    })
  })

  it('focus is calculated correctly', () => {
    const { expectState } = setupTest({
      mystik: 4,
      willenskraft: 2,
    })
    expectState({
      fokus: 12,
    })
  })

  it('defense is calculated correctly', () => {
    const { expectState } = setupTest({
      beweglichkeit: 1,
      staerke: 2,
    })
    expectState({
      verteidigung: 15,
    })
  })

  it('mental resistance is calculated correctly', () => {
    const { expectState } = setupTest({
      verstand: 1,
      willenskraft: 2,
    })
    expectState({
      geistigerWiderstand: 15,
    })
  })

  it('physical resistance is calculated correctly', () => {
    const { expectState } = setupTest({
      konstitution: 1,
      willenskraft: 2,
    })
    expectState({
      koerperlicherWiderstand: 15,
    })
  })
})
