import { fertigkeitenDefinition } from './Fertigkeiten'

export const fertigkeitenSteigernDefinition = fertigkeitenDefinition
  .enhance(
    {
      freieFertigkeitsPunkte: { type: 'number' },
    },
    {},
    {},
    {},
    {}
  )
  .addEvents(
    {
      fertigkeitSteigern: {
        fertigkeit: 'group.fertigkeiten',
      },
    },
    {
      fertigkeitSteigern: {
        apply(
          { mutate, reject },
          { fertigkeit },
          { rawAttributes, attributes }
        ) {
          const maximalWert = 6 + 3 * (attributes.heldengrad - 1)
          if (rawAttributes[fertigkeit] >= maximalWert) {
            reject(`Maximal ${maximalWert} Punkte pro Fertigkeit`)
          }

          // Steigern mit Punkt
          if (rawAttributes.freieFertigkeitsPunkte >= 1) {
            mutate('freieFertigkeitsPunkte', {
              type: 'subtract',
              amount: 1,
            })
            mutate(fertigkeit, {
              type: 'add',
              amount: 1,
            })
            return
          }

          // Steigern mit Erfahrungspunkten
          const erfahrungspunktKosten =
            3 + 2 * Math.max(0, Math.floor((rawAttributes[fertigkeit] - 6) / 3))
          const freieErfahrungspunkte =
            attributes.erfahrungspunkte - attributes.erfahrungspunkteEingesetzt
          if (freieErfahrungspunkte < erfahrungspunktKosten) {
            reject('Nicht genug Erfahrungspunkte')
          }
          mutate('erfahrungspunkteEingesetzt', {
            type: 'add',
            amount: erfahrungspunktKosten,
          })
          mutate(fertigkeit, {
            type: 'add',
            amount: 1,
          })
        },
      },
    }
  )
