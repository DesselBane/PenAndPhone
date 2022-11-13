import { FlatAttributeGroupDefinitions } from '../character-development/Attributes'
import { defineCharacter } from '../character-development/Character'

const baseDefinition = defineCharacter(
  {
    // System
    erschaffungsZustand: {
      type: 'single-select',
      options: [1, 2, 3, 4] as const,
    },
    attributPunkte: { type: 'number' },
    erschaffungsFertigkeitsPunkte: { type: 'number' },
    meisterschaftsPunkte: { type: 'number' },

    // Basis
    name: { type: 'text' },
    rasse: {
      type: 'single-select',
      options: ['alb', 'gnom', 'mensch', 'varg', 'zwerg'] as const,
    },
    erfahrungspunkte: { type: 'number' },
    erfahrungspunkteEingesetzt: { type: 'number' },
    heldengrad: { type: 'single-select', options: [1, 2, 3, 4] as const },
    splitterpunkte: { type: 'number' },

    // Meisterschaften
    meisterschaften: {
      type: 'multi-select',
      options: ['blitzreflexe1', 'blitzreflexe2', 'blitzreflexe3'] as const,
    },

    // Attribute
    ausstrahlung: { type: 'number' },
    beweglichkeit: { type: 'number' },
    intuition: { type: 'number' },
    konstitution: { type: 'number' },
    mystik: { type: 'number' },
    staerke: { type: 'number' },
    verstand: { type: 'number' },
    willenskraft: { type: 'number' },

    // Abgeleitete Werte
    groessenklasse: {
      type: 'single-select',
      options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const,
    },
    geschwindigkeit: { type: 'number' },
    initiative: { type: 'number' },
    lebenspunkte: { type: 'number' },
    fokus: { type: 'number' },

    // Widerstandswerte
    verteidigung: { type: 'number' },
    geistigerWiderstand: { type: 'number' },
    koerperlicherWiderstand: { type: 'number' },

    // Allgemeine Fertigkeiten
    akrobatik: { type: 'number' },
    alchemie: { type: 'number' },
    anfuehren: { type: 'number' },
    arkaneKunde: { type: 'number' },
    athletik: { type: 'number' },
    darbietung: { type: 'number' },
    diplomatie: { type: 'number' },
    edelhandwerk: { type: 'number' },
    empathie: { type: 'number' },
    entschlossenheit: { type: 'number' },
    fingerfertigkeit: { type: 'number' },
    geschichtenUndMythen: { type: 'number' },
    handwerk: { type: 'number' },
    heilkunde: { type: 'number' },
    heimlichkeit: { type: 'number' },
    jagdkunst: { type: 'number' },
    laenderkunde: { type: 'number' },
    naturkunde: { type: 'number' },
    redegewandheit: { type: 'number' },
    schloesserUndFallen: { type: 'number' },
    schwimmen: { type: 'number' },
    seefahrt: { type: 'number' },
    strassenkunde: { type: 'number' },
    tierfuehrung: { type: 'number' },
    ueberleben: { type: 'number' },
    wahrnehmung: { type: 'number' },
    zaehigkeit: { type: 'number' },

    // Magieschulen
    bann: { type: 'number' },
    beherrschung: { type: 'number' },
    bewegung: { type: 'number' },
    erkenntnis: { type: 'number' },
    fels: { type: 'number' },
    feuer: { type: 'number' },
    heilung: { type: 'number' },
    illusion: { type: 'number' },
    kampf: { type: 'number' },
    licht: { type: 'number' },
    natur: { type: 'number' },
    schatten: { type: 'number' },
    schicksal: { type: 'number' },
    schutz: { type: 'number' },
    staerkung: { type: 'number' },
    tod: { type: 'number' },
    verwandlung: { type: 'number' },
    wasser: { type: 'number' },
    wind: { type: 'number' },

    // Kampffertigkeiten
    handgemenge: { type: 'number' },
    hiebwaffen: { type: 'number' },
    kettenwaffen: { type: 'number' },
    klingenwaffen: { type: 'number' },
    stangenwaffen: { type: 'number' },
    schusswaffen: { type: 'number' },
    wurfwaffen: { type: 'number' },
  },
  {
    basis: [
      'name',
      'rasse',
      'erfahrungspunkte',
      'erfahrungspunkteEingesetzt',
      'heldengrad',
      'splitterpunkte',
      'meisterschaften',
    ],
    attribute: [
      'ausstrahlung',
      'beweglichkeit',
      'intuition',
      'konstitution',
      'mystik',
      'staerke',
      'verstand',
      'willenskraft',
    ],
    abgeleiteteWerte: [
      'groessenklasse',
      'geschwindigkeit',
      'initiative',
      'lebenspunkte',
      'fokus',
      'verteidigung',
      'geistigerWiderstand',
      'koerperlicherWiderstand',
    ],
    widerstandsWerte: [
      'verteidigung',
      'geistigerWiderstand',
      'koerperlicherWiderstand',
    ],
    fertigkeiten: {
      allgemeineFertigkeiten: [
        'akrobatik',
        'alchemie',
        'anfuehren',
        'arkaneKunde',
        'athletik',
        'darbietung',
        'diplomatie',
        'edelhandwerk',
        'empathie',
        'entschlossenheit',
        'fingerfertigkeit',
        'geschichtenUndMythen',
        'handwerk',
        'heilkunde',
        'heimlichkeit',
        'jagdkunst',
        'laenderkunde',
        'naturkunde',
        'redegewandheit',
        'schloesserUndFallen',
        'schwimmen',
        'seefahrt',
        'strassenkunde',
        'tierfuehrung',
        'ueberleben',
        'wahrnehmung',
        'zaehigkeit',
      ],
      magieSchulen: [
        'bann',
        'beherrschung',
        'bewegung',
        'erkenntnis',
        'fels',
        'feuer',
        'heilung',
        'illusion',
        'kampf',
        'licht',
        'natur',
        'schatten',
        'schicksal',
        'schutz',
        'staerkung',
        'tod',
        'verwandlung',
        'wasser',
        'wind',
      ],
      kampfFertigkeiten: [
        'handgemenge',
        'hiebwaffen',
        'kettenwaffen',
        'klingenwaffen',
        'stangenwaffen',
        'schusswaffen',
        'wurfwaffen',
      ],
    },
  },
  {
    // Basis
    heldengrad: ({ attributes }) => {
      if (attributes.erfahrungspunkteEingesetzt < 100) {
        return 1
      }

      if (attributes.erfahrungspunkteEingesetzt < 300) {
        return 2
      }

      if (attributes.erfahrungspunkteEingesetzt < 600) {
        return 3
      }

      return 4
    },
    splitterpunkte: ({ attributes }) => {
      return 2 + attributes.heldengrad
    },

    // Attribute
    ausstrahlung: ({ attributes, rawAttributes }) => {
      const mod = attributes.rasse === 'alb' ? 1 : 0
      return rawAttributes.ausstrahlung + mod
    },
    beweglichkeit: ({ attributes, rawAttributes }) => {
      let mod = attributes.rasse === 'alb' ? 1 : 0
      mod += attributes.rasse === 'zwerg' ? -1 : 0
      return rawAttributes.beweglichkeit + mod
    },
    konstitution: ({ attributes, rawAttributes }) => {
      let mod = attributes.rasse === 'alb' ? -1 : 0
      mod += attributes.rasse === 'zwerg' ? 1 : 0
      return rawAttributes.konstitution + mod
    },
    mystik: ({ attributes, rawAttributes }) => {
      const mod = attributes.rasse === 'gnom' ? 1 : 0
      return rawAttributes.mystik + mod
    },
    staerke: ({ attributes, rawAttributes }) => {
      let mod = attributes.rasse === 'gnom' ? -1 : 0
      mod += attributes.rasse === 'varg' ? 2 : 0
      return rawAttributes.staerke + mod
    },
    verstand: ({ attributes, rawAttributes }) => {
      const mod = attributes.rasse === 'gnom' ? 1 : 0
      return rawAttributes.verstand + mod
    },
    willenskraft: ({ attributes, rawAttributes }) => {
      let mod = attributes.rasse === 'zwerg' ? 1 : 0
      mod += attributes.rasse === 'varg' ? -1 : 0
      return rawAttributes.willenskraft + mod
    },

    // Abgeleitete Werte
    groessenklasse: ({ attributes }) => {
      switch (attributes.rasse) {
        case 'alb':
          return 5
        case 'gnom':
          return 3
        case 'mensch':
          return 5
        case 'varg':
          return 6
        case 'zwerg':
          return 4
      }
    },
    geschwindigkeit: ({ attributes }) => {
      return attributes.beweglichkeit + attributes.groessenklasse
    },
    initiative: ({ attributes }) => {
      return 10 - attributes.intuition
    },
    lebenspunkte: ({ attributes }) => {
      return attributes.konstitution + attributes.groessenklasse
    },
    fokus: ({ attributes }) => {
      return (attributes.mystik + attributes.willenskraft) * 2
    },

    // Widerstandswerte
    verteidigung: ({ attributes }) => {
      return 12 + attributes.beweglichkeit + attributes.staerke
    },
    geistigerWiderstand: ({ attributes }) => {
      return 12 + attributes.verstand + attributes.willenskraft
    },
    koerperlicherWiderstand: ({ attributes }) => {
      return 12 + attributes.konstitution + attributes.willenskraft
    },

    // Fertigkeiten
    akrobatik: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.akrobatik + attributes.beweglichkeit + attributes.staerke
      )
    },
    alchemie: ({ attributes, rawAttributes }) => {
      return rawAttributes.alchemie + attributes.mystik + attributes.verstand
    },
    anfuehren: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.anfuehren +
        attributes.ausstrahlung +
        attributes.willenskraft
      )
    },
    arkaneKunde: ({ attributes, rawAttributes }) => {
      return rawAttributes.arkaneKunde + attributes.mystik + attributes.verstand
    },
    athletik: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.athletik + attributes.beweglichkeit + attributes.staerke
      )
    },
    darbietung: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.darbietung +
        attributes.ausstrahlung +
        attributes.willenskraft
      )
    },
    diplomatie: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.diplomatie +
        attributes.ausstrahlung +
        attributes.willenskraft
      )
    },
    edelhandwerk: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.edelhandwerk + attributes.intuition + attributes.verstand
      )
    },
    empathie: ({ attributes, rawAttributes }) => {
      return rawAttributes.empathie + attributes.intuition + attributes.verstand
    },
    entschlossenheit: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.entschlossenheit +
        attributes.ausstrahlung +
        attributes.willenskraft
      )
    },
    fingerfertigkeit: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.fingerfertigkeit +
        attributes.ausstrahlung +
        attributes.beweglichkeit
      )
    },
    geschichtenUndMythen: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.geschichtenUndMythen +
        attributes.mystik +
        attributes.verstand
      )
    },
    handwerk: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.handwerk + attributes.konstitution + attributes.verstand
      )
    },
    heilkunde: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.heilkunde + attributes.intuition + attributes.verstand
      )
    },
    heimlichkeit: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.heimlichkeit +
        attributes.beweglichkeit +
        attributes.intuition
      )
    },
    jagdkunst: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.jagdkunst + attributes.konstitution + attributes.verstand
      )
    },
    laenderkunde: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.laenderkunde + attributes.intuition + attributes.verstand
      )
    },
    naturkunde: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.naturkunde + attributes.intuition + attributes.verstand
      )
    },
    redegewandheit: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.redegewandheit +
        attributes.ausstrahlung +
        attributes.willenskraft
      )
    },
    schloesserUndFallen: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.schloesserUndFallen +
        attributes.beweglichkeit +
        attributes.intuition
      )
    },
    schwimmen: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.schwimmen + attributes.konstitution + attributes.staerke
      )
    },
    seefahrt: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.seefahrt +
        attributes.beweglichkeit +
        attributes.konstitution
      )
    },
    strassenkunde: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.strassenkunde +
        attributes.ausstrahlung +
        attributes.intuition
      )
    },
    tierfuehrung: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.tierfuehrung +
        attributes.beweglichkeit +
        attributes.ausstrahlung
      )
    },
    ueberleben: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.ueberleben +
        attributes.intuition +
        attributes.konstitution
      )
    },
    wahrnehmung: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.wahrnehmung +
        attributes.intuition +
        attributes.willenskraft
      )
    },
    zaehigkeit: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.zaehigkeit +
        attributes.konstitution +
        attributes.willenskraft
      )
    },

    // Magieschulen
    bann: ({ attributes, rawAttributes }) => {
      return rawAttributes.bann + attributes.mystik + attributes.willenskraft
    },
    beherrschung: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.beherrschung + attributes.mystik + attributes.willenskraft
      )
    },
    bewegung: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.bewegung + attributes.mystik + attributes.beweglichkeit
      )
    },
    erkenntnis: ({ attributes, rawAttributes }) => {
      return rawAttributes.erkenntnis + attributes.mystik + attributes.verstand
    },
    fels: ({ attributes, rawAttributes }) => {
      return rawAttributes.fels + attributes.mystik + attributes.konstitution
    },
    feuer: ({ attributes, rawAttributes }) => {
      return rawAttributes.feuer + attributes.mystik + attributes.ausstrahlung
    },
    heilung: ({ attributes, rawAttributes }) => {
      return rawAttributes.heilung + attributes.mystik + attributes.ausstrahlung
    },
    illusion: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.illusion + attributes.mystik + attributes.ausstrahlung
      )
    },
    kampf: ({ attributes, rawAttributes }) => {
      return rawAttributes.kampf + attributes.mystik + attributes.staerke
    },
    licht: ({ attributes, rawAttributes }) => {
      return rawAttributes.licht + attributes.mystik + attributes.ausstrahlung
    },
    natur: ({ attributes, rawAttributes }) => {
      return rawAttributes.natur + attributes.mystik + attributes.ausstrahlung
    },
    schatten: ({ attributes, rawAttributes }) => {
      return rawAttributes.schatten + attributes.mystik + attributes.intuition
    },
    schicksal: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.schicksal + attributes.mystik + attributes.ausstrahlung
      )
    },
    schutz: ({ attributes, rawAttributes }) => {
      return rawAttributes.schutz + attributes.mystik + attributes.ausstrahlung
    },
    staerkung: ({ attributes, rawAttributes }) => {
      return rawAttributes.staerkung + attributes.mystik + attributes.staerke
    },
    tod: ({ attributes, rawAttributes }) => {
      return rawAttributes.tod + attributes.mystik + attributes.verstand
    },
    verwandlung: ({ attributes, rawAttributes }) => {
      return (
        rawAttributes.verwandlung + attributes.mystik + attributes.konstitution
      )
    },
    wasser: ({ attributes, rawAttributes }) => {
      return rawAttributes.wasser + attributes.mystik + attributes.intuition
    },
    wind: ({ attributes, rawAttributes }) => {
      return rawAttributes.wind + attributes.mystik + attributes.verstand
    },
  },
  {
    erfahrungspunkteHinzufuegen: {
      menge: 'number',
    },
    nameSetzen: {
      name: 'name.value',
    },
    rasseSetzen: {
      rasse: 'rasse.value',
    },
    attributSteigernMitPunkt: {
      attribut: 'group.attribute',
    },
    fertigkeitSteigernMitPunkt: {
      fertigkeit: 'group.fertigkeiten',
    },
    erschaffungWeiter: {},
  },
  {
    erfahrungspunkteHinzufuegen: {
      apply({ mutate }, { menge }) {
        mutate('erfahrungspunkte', {
          type: 'add',
          amount: menge,
        })
      },
    },
    nameSetzen: {
      apply({ mutate }, { name }) {
        mutate('name', { value: name })
      },
    },
    erschaffungWeiter: {
      apply({ mutate, reject }, _, { rawAttributes }, { groups }) {
        const naechsterZustand = rawAttributes.erschaffungsZustand + 1
        if (naechsterZustand > 4) {
          reject('Letzte Erschaffungsstufe erreicht.')
          return
        }

        if (naechsterZustand === 3) {
          // 18 Attributpunkte, wobei jedes mindestens einen haben muss
          groups.attribute.forEach((attributKey) => {
            mutate(attributKey, {
              type: 'add',
              amount: 1,
            })
          })
          // Alle Rassen bekommen einen zusätzlichen Attributpunkt
          // Menschen bekommen zwei zusätzliche Attributpunkte
          const attributPunkte = rawAttributes.rasse === 'mensch' ? 12 : 11
          mutate('attributPunkte', {
            type: 'add',
            amount: attributPunkte,
          })
          mutate('erschaffungsFertigkeitsPunkte', {
            type: 'add',
            amount: 55,
          })
          mutate('erfahrungspunkte', {
            type: 'add',
            amount: 15,
          })
          mutate('meisterschaftsPunkte', {
            type: 'add',
            amount: 3,
          })
        }

        mutate('erschaffungsZustand', {
          option: naechsterZustand as any,
        })
      },
    },
    rasseSetzen: {
      apply({ mutate }, { rasse }) {
        mutate('rasse', {
          option: rasse,
        })
      },
    },
    attributSteigernMitPunkt: {
      apply({ mutate, reject }, { attribut }, { rawAttributes }, { groups }) {
        if (rawAttributes.attributPunkte < 1) {
          reject('Alle Punkte sind aufgebraucht')
        }

        // Menschen dürfen 2 Attribute auf 4 setzen
        const attributeMitWert4 = groups.attribute.filter(
          (key) => rawAttributes[key] >= 4
        ).length
        const erlaubtMitWert4 = rawAttributes.rasse === 'mensch' ? 2 : 1
        let maxWert = attributeMitWert4 < erlaubtMitWert4 ? 4 : 3

        // Varge dürfen Stärke nicht auf 4 setzen (haben bereits +2 auf Stärke)
        if (attribut === 'staerke' && rawAttributes.rasse === 'varg') {
          maxWert = 3
        }

        if (rawAttributes[attribut] >= maxWert) {
          reject('Maximalpunkte erreicht')
        }
        mutate('attributPunkte', {
          type: 'subtract',
          amount: 1,
        })
        mutate(attribut, {
          type: 'add',
          amount: 1,
        })
      },
    },
    fertigkeitSteigernMitPunkt: {
      apply({ mutate, reject }, { fertigkeit }, { rawAttributes }) {
        if (rawAttributes.erschaffungsFertigkeitsPunkte < 1) {
          reject('Alle Fertigkeitspunkte sind aufgebraucht')
        }
        if (rawAttributes[fertigkeit] >= 6) {
          reject('Maximal 6 Punkte pro Fertigkeit')
        }
        mutate('erschaffungsFertigkeitsPunkte', {
          type: 'subtract',
          amount: 1,
        })
        mutate(fertigkeit, {
          type: 'add',
          amount: 1,
        })
      },
    },
  }
)

type Attributes = typeof baseDefinition['attributes']
type AttributesGroups = typeof baseDefinition['groups']

type MeisterschaftName = Attributes['meisterschaften']['options'][number]

type FertigkeitName = FlatAttributeGroupDefinitions<
  Attributes,
  AttributesGroups
>['fertigkeiten'][number]

type MeisterschaftDefinitions = Record<
  MeisterschaftName,
  {
    level: number
    fertigkeit: FertigkeitName
    voraussetzung?: MeisterschaftName[]
  }
>

export const meisterschaften: MeisterschaftDefinitions = {
  blitzreflexe1: {
    level: 1,
    fertigkeit: 'akrobatik',
  },
  blitzreflexe2: {
    level: 1,
    fertigkeit: 'akrobatik',
    voraussetzung: ['blitzreflexe1'],
  },
  blitzreflexe3: {
    level: 2,
    fertigkeit: 'akrobatik',
    voraussetzung: ['blitzreflexe2'],
  },
}

export function meisterschaftenInFertigkeit(fertigkeit: string) {
  return Object.entries(meisterschaften)
    .filter(([, meisterschaft]) => meisterschaft.fertigkeit === fertigkeit)
    .map(([name, meisterschaft]) => ({
      ...meisterschaft,
      name: name as MeisterschaftName,
    }))
}

export const characterDefinition = baseDefinition.addEvents(
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
          if (erworbeneMeisterschaft.fertigkeit !== meisterschaft.fertigkeit) {
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
