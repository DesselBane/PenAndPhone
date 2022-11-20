import { Magieschule } from './Magieschulen'

const ZAUBERARTEN = ['spruch', 'ritus'] as const
type Zauberart = typeof ZAUBERARTEN[number]

const ZAUBERGRADE = [0, 1, 2, 3, 4, 5] as const
type Zauberschule = `${Magieschule} ${typeof ZAUBERGRADE[number]}`

// TODO: Alle typus ergänzen
const ZAUBERTYPUS = [
  'aura',
  'wahrnehmung',
  'verstaendigung',
  'verhuellung',
] as const
type Zaubertypus = typeof ZAUBERTYPUS[number]

type Zauberkosten = `K${number}V${number}` | `${number}V${number}` | `${number}`

interface Zauber {
  name: string
  art: Zauberart
  schulen: ReadonlyArray<Zauberschule>
  typus: ReadonlyArray<Zaubertypus>
  kosten: Zauberkosten
  zauberdauer: number
  wirkung: string
}

function zauberlisteBauen<TListe extends ReadonlyArray<Zauber>>(
  zauberliste: TListe
) {
  return zauberliste
}

export const zauberliste = zauberlisteBauen([
  {
    name: 'alarm',
    art: 'spruch',
    schulen: ['erkenntnis 1', 'schutz 1'],
    typus: ['wahrnehmung'],
    kosten: '4V1',
    zauberdauer: 2,
    wirkung: `Der Zauberer wird alarmiert, wenn eines oder mehrere Wesen der Größenklasse 2 oder höher den Wirkungsbereich betritt. Er vermag dabei keinen genauen Ort zu bestimmen, sondern lediglich die pure Anwesenheit festzustellen, ebenso wenig kann er Angaben zur Anzahl machen. Es ist möglich, bis zu zehn bestimmte Wesen seiner Wahl von der Alarmierung auszunehmen.`,
  },
] as const)

export const zauberNamen = zauberliste.map(({ name }) => name)

export function zauberNachNamen(name: typeof zauberNamen[number]) {
  return zauberliste.find((zauber) => zauber.name === name)
}

export function zauberInSchule(schule: Magieschule) {
  return zauberliste.filter(({ schulen }) =>
    schulen.some((s) => s.includes(schule))
  )
}

export function zauberNamenInSchule(schule: Magieschule) {
  return zauberInSchule(schule).map(({ name }) => name)
}
