import { meisterschaftenDefinition, meisterschaften } from './Meisterschaften'

export const meisterschaftenSteigernDefinition = meisterschaftenDefinition
  .enhance({ meisterschaftsPunkte: { type: 'number' } }, {}, {}, {}, {})
  .addEvents(
    {
      meisterschaftLernen: {
        name: 'meisterschaften.value',
      },
    },
    {
      meisterschaftLernen: {
        apply({ mutate, reject }, { name }, { rawAttributes }, _, history) {
          const meisterschaft = meisterschaften[name]
          if (rawAttributes.meisterschaften.includes(name)) {
            reject('Meisterschaft wurde bereits gelernt')
            return
          }

          const voraussetzungen = meisterschaft.voraussetzung ?? []
          if (
            !voraussetzungen.every((name) =>
              rawAttributes.meisterschaften.includes(name)
            )
          ) {
            reject('Nicht alle Voraussetzungen erfüllt')
            return
          }

          // Für Meisterschaftspunkte kaufen
          if (
            rawAttributes.meisterschaftsPunkte > 0 &&
            meisterschaft.level === 1
          ) {
            mutate('meisterschaftsPunkte', {
              type: 'subtract',
              amount: 1,
            })
            mutate('meisterschaften', {
              type: 'add',
              option: name,
            })
            return
          }

          const fertigkeitPunkte = rawAttributes[meisterschaft.fertigkeit]
          const meisterschaftsSchwelle = Math.floor((fertigkeitPunkte - 3) / 3)
          if (meisterschaftsSchwelle < meisterschaft.level) {
            reject('Zu niedrige Meisterschaftsschwelle')
            return
          }

          const kostenloseErwerbe = history.filter((event) => {
            if (event.type !== 'meisterschaftLernen') {
              return false
            }
            const erworbeneMeisterschaft = meisterschaften[event.payload.name]
            if (
              erworbeneMeisterschaft.fertigkeit !== meisterschaft.fertigkeit
            ) {
              return false
            }
            if (
              event.mutations.some(
                (mutation) =>
                  mutation.key === 'erfahrungspunkteEingesetzt' ||
                  mutation.key === 'meisterschaftsPunkte'
              )
            ) {
              return false
            }
            return true
          })

          // TODO: maximal eine auf level3, zwei auf level2, drei auf level1
          if (kostenloseErwerbe.length < meisterschaftsSchwelle) {
            mutate('meisterschaften', {
              type: 'add',
              option: name,
            })
            return
          }

          const freieErfahrungspunkte =
            rawAttributes.erfahrungspunkte -
            rawAttributes.erfahrungspunkteEingesetzt

          if (freieErfahrungspunkte < 15) {
            reject('Zu wenig Erfahrungspunkte')
            return
          }

          mutate('meisterschaften', {
            type: 'add',
            option: name,
          })
          mutate('erfahrungspunkteEingesetzt', {
            type: 'add',
            amount: 15,
          })
        },
      },
    }
  )
