import { mapToAttributeDefinitions } from '../character-development/Attributes'
import { fertigkeitenDefinition, fertigkeiten } from './Fertigkeiten'

const fertigkeitsMeisterschaftsPunkte =
  fertigkeiten.map<`${typeof fertigkeiten[number]}MeisterschaftsPunkte`>(
    (fertigkeit) => `${fertigkeit}MeisterschaftsPunkte`
  )

const meisterschaftsSchwellen = [6, 9, 12] as const

export const fertigkeitenSteigernDefinition = fertigkeitenDefinition
  .addAttributes({
    freieFertigkeitsPunkte: { type: 'number' },
    ...mapToAttributeDefinitions(fertigkeitsMeisterschaftsPunkte, {
      type: 'multi-select',
      options: [1, 2, 3],
    }),
  })
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
          // Meisterschaftsschwelle erreicht?
          const meisterschaftsSchwelle = meisterschaftsSchwellen.findIndex(
            (schwelle) => schwelle === rawAttributes[fertigkeit] + 1
          )

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
            if (meisterschaftsSchwelle > -1) {
              mutate(`${fertigkeit}MeisterschaftsPunkte`, {
                type: 'add',
                option: meisterschaftsSchwelle + 1,
              })
            }
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
          if (meisterschaftsSchwelle > -1) {
            mutate(`${fertigkeit}MeisterschaftsPunkte`, {
              type: 'add',
              option: meisterschaftsSchwelle + 1,
            })
          }
        },
      },
    }
  )
