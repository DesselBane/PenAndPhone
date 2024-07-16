export class AssertionError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}
export class ParseError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export function isIncludedInDefinition<const TValue>(
  definition: readonly TValue[],
  data: unknown
): data is TValue {
  return definition.includes(data as any)
}
export function assertIsIncludedInDefinition<const TValue>(
  definition: readonly TValue[],
  data: unknown
): asserts data is TValue {
  if (!isIncludedInDefinition(definition, data)) {
    throw new AssertionError(
      `Expected ${String(data)} to be part of ${definition}`
    )
  }
}

export const ZEITEINHEITEN = [
  'ticks',
  'sekunden',
  'minuten',
  'stunden',
] as const
export type Zeiteinheit = (typeof ZEITEINHEITEN)[number]
export type Zeitlänge = [menge: number, einheit: Zeiteinheit]
export function parseZeitlänge(data: string): Zeitlänge | ParseError {
  const formatExpectMessage =
    'Expected the format of "<number><space><zeiteinheit>"'

  const parts = data.trim().toLowerCase().split(' ')

  if (parts.length !== 2) {
    return new ParseError(
      `${formatExpectMessage} but received too many/few spaces. Received ${parts.length - 1} spaces for string ${data}`
    )
  }

  const [amountString, einheit] = parts

  if (!isIncludedInDefinition(ZEITEINHEITEN, einheit)) {
    return new ParseError(
      `${formatExpectMessage} but received ${einheit} in place of zeiteinheit.`
    )
  }

  const amount = Number.parseFloat(amountString)

  if (Number.isNaN(amount) || !Number.isInteger(amount)) {
    return new ParseError(
      `${formatExpectMessage} but received ${amountString} instead on integer.`
    )
  }

  return [amount, einheit]
}

export const SIMPLE_ZAUBERDAUER = [
  'Kanalisiert',
  'Sofort',
  'Permanent',
] as const
export type SimpleZauberdauer = (typeof SIMPLE_ZAUBERDAUER)[number]
export type Zauberdauer = Zeitlänge | SimpleZauberdauer
export function parseZauberdauer(data: string): Zauberdauer | ParseError {
  if (isIncludedInDefinition(SIMPLE_ZAUBERDAUER, data)) {
    return data
  }

  const zeitlänge = parseZeitlänge(data)
  if (!(zeitlänge instanceof ParseError)) {
    return zeitlänge
  }

  return new ParseError(
    `Expected either a SimpleZauberdauer or a Zeitlänge. Received ${data}`,
    { cause: zeitlänge }
  )
}

export type FokusKosten = [
  erschöpft: number,
  kanalisiert: number,
  verzehrt: number,
]
export function parseFokusKosten(data: string): FokusKosten | ParseError {
  const regEx = new RegExp(/^(K?\d+)(V\d+)?$/)
  const retVal: FokusKosten = [0, 0, 0]
  const parts = data.trim().match(regEx)
  const parseError = new ParseError(
    `Expected input to match the following regex: ${regEx} but it did not. Received: ${data}`
  )

  if (parts == null) {
    return parseError
  }

  let firstPart = parts[1]
  const secondPart = parts[2]

  const isKanalisiert = firstPart.startsWith('K')

  if (isKanalisiert) {
    firstPart = firstPart.slice(1)
  }

  let firstPartAmount = Number.parseInt(firstPart)
  let secondPartAmount = 0

  if (secondPart != null) {
    secondPartAmount = Number.parseInt(secondPart.slice(1))
  }

  firstPartAmount = firstPartAmount - secondPartAmount

  if (firstPartAmount < 0) {
    return new ParseError(
      'Verzehrt can not be greater then Erschöpft/Kanalisiert.'
    )
  }

  if (isKanalisiert) {
    retVal[1] = firstPartAmount
  } else {
    retVal[0] = firstPartAmount
  }
  retVal[2] = secondPartAmount

  return retVal
}

export type Reichweite =
  | 'Zauberer'
  | 'Behrührung'
  | [menge: number, einheit: 'meter']

export const HELDENGRADE = [1, 2, 3, 4] as const
export type HeldenGrad = (typeof HELDENGRADE)[number]

export const ZAUBERVERSTÄRKUNGSARTEN = [
  'Auslösezeit',
  'Kanalisierter Fokus',
  'Verzehrter Fokus',
  'Erschöpfter Fokus',
  'Reichweite',
] as const
export type Zauberverstärkungsart = (typeof ZAUBERVERSTÄRKUNGSARTEN)[number]
export type Zauberverstärkung =
  | [art: Zauberverstärkungsart]
  | [
      art: 'Verstärken',
      erfolgsgrade: number,
      fokusKosten: FokusKosten,
      beschreibung: string,
    ]
export function parseZauberverstärkung(
  data: string
): Zauberverstärkung[] | ParseError {
  const retVal: Zauberverstärkung[] = []
  const parts = data
    .trim()
    .split('•')
    .filter((x) => x != '')
  const firstSubParts = parts[0].trim().split(',')
  let hasVerstärken = false

  console.log('parts', parts)

  for (const subPart of firstSubParts) {
    const currentPart = subPart.trim()

    if (currentPart === '') {
      continue
    }

    if (isIncludedInDefinition(ZAUBERVERSTÄRKUNGSARTEN, currentPart)) {
      retVal.push([currentPart])
      continue
    }
    if (currentPart === 'Verstärken (s. u.)') {
      hasVerstärken = true
      continue
    }

    return new ParseError(
      `Unknown verstärkung: "${currentPart}" within ${data}`
    )
  }

  if (hasVerstärken) {
    const secondPart = parts[1]?.trim()

    if (secondPart == null) {
      return new ParseError(
        `Found "Verstärken" but not its description. Data: ${data}`
      )
    }

    const [cost, description] = secondPart.split(':')
    const costRegExp = new RegExp(/(\d+) EG \(Kosten \+(K?\d+V\d+)?\)/)
    const matches = cost.match(costRegExp)

    if (matches == null) {
      return new ParseError(
        `Expected costs to match ${costRegExp} but it did not. Costs ${cost} within data: ${data}`
      )
    }

    const [_, erfolgsgrade, fokusKosten] = matches

    const fokus = parseFokusKosten(fokusKosten)

    if (fokus instanceof ParseError) {
      return new ParseError(
        `Could not parse fokusKosten in cost: ${cost} within data ${data}. See cause for more info`,
        { cause: fokus }
      )
    }

    retVal.push([
      'Verstärken',
      Number.parseInt(erfolgsgrade),
      fokus,
      description.trim(),
    ])
  }

  return retVal
}

export const ZAUBERSCHULEN = [
  'Erkenntnis',
  'Schutz',
  'Stärkung',
  'Bann',
  'Heilung',
  'Schatten',
  'Feuer',
  'Verwandlung',
  'Kampf',
  'Wind',
  'Beherrschung',
  'Bewegung',
  'Natur',
  'Illusion',
  'Licht',
  'Wasser',
  'Tod',
  'Schicksal',
  'Fels',
] as const
export type Zauberschule = (typeof ZAUBERSCHULEN)[number]

export const ZAUBERARTEN = ['Spruch', 'Ritus'] as const
export type Zauberart = (typeof ZAUBERARTEN)[number]

export const TYPI = [
  'Wahrnehmung',
  'Verständigung',
  'Aura',
  'Moral',
  'Konter',
  'Schaden',
  'Körper stärken',
  'Leben',
  'Verhüllung',
  'Elementarkontrolle',
  'Waffe',
  'Zauber brechen',
  'Bewegung stärken',
  'Gestalt',
  'Tiere',
  'Leuchten',
  'Elektrizität',
  'Herbeirufung',
  'Tarnung',
  'Wand',
  'Explosion',
  'Eis',
  'Einstellung',
  'Nekromantie',
  'Objekt',
  'Wildnis',
  'Gedächtnis',
  'Gedanken',
  'Feenwesen',
  'Wesen bannen',
  'Kontrolle',
  'Beschwörung',
  'Felswesen',
  'Magisches',
  'Sinne',
  'Hand',
  'Schild',
  'Schutzfeld',
  'Fluch',
  'Impersonation',
  'Telekinese',
  'Anderswelt',
  'Geisterwesen',
  'Magisches Wesen I',
  'Geräusch',
  'Geruch',
  'Pfeil',
  'Gift',
  'Hellsicht',
  'Segen',
  'Halluzination',
  'Regeneration',
  'Reinigung',
  'Schwächung',
  'Botschaft',
  'Mental',
  'Rüstung',
  'Trugbild',
  'Prophezeiung',
  'Pflanzen',
  'Haut',
  'Säure',
  'Belebung',
  'Alter',
] as const
export type Typus = (typeof TYPI)[number]

export type ZauberSchwierigkeit =
  | number
  | 'Körperlicher Wiederstand'
  | 'Geistiger Wiederstand'
  | 'Verteidigung'
export function parseZauberschwierigkeit(
  data: string
): ZauberSchwierigkeit | ParseError {
  const numberSchwierigkeit = Number.parseFloat(data)

  if (
    Number.isInteger(numberSchwierigkeit) &&
    !Number.isNaN(numberSchwierigkeit)
  ) {
    return numberSchwierigkeit
  }

  const lowerData = data.toLowerCase()

  if (lowerData.includes('verteidigung')) {
    return 'Verteidigung'
  }
  if (lowerData.includes('geistiger widerstand')) {
    return 'Geistiger Wiederstand'
  }
  if (lowerData.includes('körperlicher widerstand')) {
    return 'Körperlicher Wiederstand'
  }

  return new ParseError(
    `Data must be a number or include Verteidigung, Geistiger Wiederstand or Körperlicher Wiederstand but it did not. Got ${data}`
  )
}
