import { mapToAttributeDefinitions } from '../../character-development/Attributes'
import { fertigkeitenSteigernDefinition } from '../FertigkeitenSteigern'
import { magieSchulen } from './Magieschulen'
import { zauberNachNamen, zauberNamenInSchule } from './Zauber'

const magieschulenZauber =
  magieSchulen.map<`${typeof magieSchulen[number]}Zauber`>(
    (schule) => `${schule}Zauber`
  )

export const zauberLernenDefinition = fertigkeitenSteigernDefinition
  .addAttributes({
    ...mapToAttributeDefinitions(
      magieSchulen,
      (schule) => ({
        type: 'multi-select',
        options: zauberNamenInSchule(schule),
      }),
      (schule) => `${schule}Zauber`
    ),
  })
  .addAttributeGroups({
    magieschulenZauber: magieschulenZauber,
  })
  .addEvents(
    {
      zauberLernen: {
        schule: 'group.magieSchulen',
        name: 'group.magieschulenZauber.value',
      },
    },
    {
      zauberLernen: {
        apply(
          { reject, mutate },
          { schule, name },
          { attributes, rawAttributes }
        ) {
          const zauber = zauberNachNamen(name)
          if (!zauber) {
            reject('Zauber nicht vorhanden')
            return
          }

          const zauberSchule = zauber.schulen.find((a) => a.includes(schule))
          if (!zauberSchule) {
            reject('Zauber für diese Schule nicht möglich')
            return
          }

          const fertigkeitPunkte = rawAttributes[schule]
          if (fertigkeitPunkte < 1) {
            reject('Zauberschule nicht gelernt')
            return
          }

          const moeglicherZauberGrad = Math.floor(fertigkeitPunkte / 3)
          const zauberGrad = Number(zauberSchule.split(' ')[1])
          if (moeglicherZauberGrad < zauberGrad) {
            reject('Zu niedriger Zaubergrad')
            return
          }

          // Steigern mit Erfahrungspunkten
          const erfahrungspunktKosten = Math.max(1, zauberGrad * 3)
          const freieErfahrungspunkte =
            attributes.erfahrungspunkte - attributes.erfahrungspunkteEingesetzt
          if (freieErfahrungspunkte < erfahrungspunktKosten) {
            reject('Nicht genug Erfahrungspunkte')
            return
          }

          mutate('erfahrungspunkteEingesetzt', {
            type: 'add',
            amount: erfahrungspunktKosten,
          })
          mutate(`${schule}Zauber`, {
            type: 'add',
            option: name,
          })
        },
      },
    }
  )
