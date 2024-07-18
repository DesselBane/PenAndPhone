import type { ReadonlyDeep } from 'type-fest'

const isIntegerRegex = new RegExp(/^\d+$/)

export type ErrorContext = ReadonlyDeep<Record<string, unknown>>

export class AssertionError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class ParseError<TCause extends Error = Error> extends Error {
  public readonly context?: ErrorContext
  public readonly cause?: TCause

  constructor(
    message: string,
    context?: ErrorContext & {
      cause?: TCause
    }
  ) {
    super(message)
    this.cause = context?.cause
    const newContext = { ...context }
    delete newContext.cause
    this.context = newContext
  }

  toString() {
    return JSON.stringify(this, null, '  ')
  }
  toJSON() {
    return {
      name: 'ParseError',
      message: this.message,
      cause: this.cause,
      context: this.context,
      stackTrace: this.stack?.split('\n'),
    }
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

  if (!isIntegerRegex.test(amountString)) {
    return new ParseError(
      `${formatExpectMessage} but received ${amountString} instead on integer.`
    )
  }

  const amount = Number.parseInt(amountString)

  return [amount, einheit]
}

export const SIMPLE_ZAUBERDAUER = [
  'Kanalisiert',
  'Sofort',
  'Permanent',
] as const
export type SimpleZauberdauer = (typeof SIMPLE_ZAUBERDAUER)[number]
export type Zauberdauer = Zeitlänge | SimpleZauberdauer

export function parseZauberdauer(
  data: string
): Zauberdauer | ParseError<ParseError> {
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
  total: number,
  verzehrt: number,
  kanalisiert: boolean,
]

export function parseFokusKosten(data: string): FokusKosten | ParseError {
  const regEx = new RegExp(/^(K?\d+)(V\d+)?$/)
  const retVal: FokusKosten = [0, 0, false]
  const parts = data.trim().match(regEx)
  const parseError = new ParseError(
    `Expected input to match the following regex: ${regEx} but it did not. Received: ${data}`
  )

  if (parts == null) {
    return parseError
  }

  let firstPart = parts[1]
  const secondPart = parts[2]

  retVal[2] = firstPart.startsWith('K')

  if (retVal[2]) {
    firstPart = firstPart.slice(1)
  }

  retVal[0] = Number.parseInt(firstPart)

  if (secondPart != null) {
    retVal[1] = Number.parseInt(secondPart.slice(1))
  }

  if (retVal[1] > retVal[0]) {
    return new ParseError(
      'Verzehrt can not be greater then Erschöpft/Kanalisiert.'
    )
  }

  return retVal
}

export const SIMPLE_REICHWEITEN = ['Zauberer', 'Behrührung'] as const
export type SimpleReichweite = (typeof SIMPLE_REICHWEITEN)[number]
export const REICHWEITE_EINHEITEN = ['meter'] as const
export type ReichweiteEinheit = (typeof REICHWEITE_EINHEITEN)[number]

export type Reichweite =
  | SimpleReichweite
  | [menge: number, einheit: ReichweiteEinheit]

export function parseReichweite(data: string): Reichweite | ParseError {
  if (isIncludedInDefinition(SIMPLE_REICHWEITEN, data)) {
    return data
  }
  if (/^\d+ meter$/.test(data)) {
    return [Number.parseInt(data.split(' ')[0]), 'meter']
  }

  return new ParseError(
    `Data did not match the format "<number><space><einheit>" nor was it a valid value.`,
    {
      data,
      validValues: SIMPLE_REICHWEITEN,
      validEinheiten: REICHWEITE_EINHEITEN,
    }
  )
}

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
): Zauberverstärkung[] | ParseError<ParseError> {
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

export type Zauberschulvorrausetzung = [Zauberschule, HeldenGrad]

export function parseZauberschulvorrausetzung(
  data: string
): Zauberschulvorrausetzung[] | ParseError {
  const retVal: Zauberschulvorrausetzung[] = []

  const parts = data.trim().split(',')

  for (const part of parts) {
    const [schule, grad] = part
      .trim()
      .split(' ')
      .filter((x) => x !== '')

    if (!isIncludedInDefinition(ZAUBERSCHULEN, schule)) {
      return new ParseError(`Unknown schule: "${schule}" detected in "${data}"`)
    }
    const gradParsed = Number.parseInt(grad)

    if (
      !isIntegerRegex.test(grad) ||
      !isIncludedInDefinition(HELDENGRADE, gradParsed)
    ) {
      return new ParseError(
        `Invalid Heldengrad received: "${grad}" valid values are: "${HELDENGRADE}" in "${data}"`
      )
    }
    retVal.push([schule, gradParsed])
  }

  return retVal
}

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

export const SIMPLE_ZAUBERSCHWIERIGKEITEN = [
  'Körperlicher Wiederstand',
  'Geistiger Wiederstand',
  'Verteidigung',
]
export type SimpleZauberschwierigkeit =
  (typeof SIMPLE_ZAUBERSCHWIERIGKEITEN)[number]
export type ZauberSchwierigkeit = number | SimpleZauberschwierigkeit

export function parseZauberschwierigkeit(
  data: string
): ZauberSchwierigkeit | ParseError {
  if (isIntegerRegex.test(data)) {
    return Number.parseInt(data)
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
    `Data was neither a number nor included it a valid value.`,
    {
      data,
      validValues: SIMPLE_ZAUBERSCHWIERIGKEITEN,
    }
  )
}

export type Zauber = {
  name: string
  art: Zauberart
  schulen: Zauberschulvorrausetzung[]
  typus: Typus
  schwierigkeit: ZauberSchwierigkeit
  kosten: FokusKosten
  reichweite: Reichweite
  zauberdauer: Zeitlänge
  wirkung: string
  wirkungsdauer: Zeitlänge
  wirkungsbereich?: Reichweite
  erfolgsgrade: Zauberverstärkung[]
}

export function classify(data: string) {
  if (data.includes('(Spruch)')) return 'Spruch'
  if (data.includes('(Ritus)')) return 'Ritus'
  if (data.includes('Schulen:')) return 'Schulen'
  if (data.includes('Typus:')) return 'Typus'
  if (data.includes('Schwierigkeit:')) return 'Schwierigkeit'
  if (data.includes('Kosten:')) return 'Kosten'
  if (data.includes('Zauberdauer:')) return 'Zauberdauer'
  if (data.includes('Reichweite:')) return 'Reichweite'
  if (data.includes('Wirkung:')) return 'Wirkung'
  if (data.includes('Wirkungsdauer:')) return 'Wirkungsdauer'
  if (data.includes('Wirkungsbereich:')) return 'Wirkungsbereich'
  if (data.includes('Erfolgsgrade:')) return 'Erfolgsgrade'

  return 'None'
}

export function parseZauber(data: string[]): Zauber | ParseError<ParseError> {
  const zauber: Partial<Zauber> = {}

  while (data.length > 0) {
    const currentRow = data.shift()

    if (currentRow == null) {
      return new ParseError('Unexpected end of data')
    }
    const currentRightSide = currentRow.split(':')[1]?.trim()

    const classification = classify(currentRow)

    switch (classification) {
      case 'Spruch':
        zauber.art = 'Spruch'
        zauber.name = currentRow.replace('(Spruch)', '').trim()
        break
      case 'Ritus':
        zauber.art = 'Ritus'
        zauber.name = currentRow.replace('(Ritus)', '').trim()
        break
      case 'Schulen':
        const schulen = parseZauberschulvorrausetzung(currentRightSide)
        if (schulen instanceof ParseError) {
          return new ParseError(`Could not parse Schulen`, {
            cause: schulen,
            currentRow,
            data,
          })
        }
        zauber.schulen = schulen
        break
      case 'Typus':
        const typus = currentRightSide
        if (!isIncludedInDefinition(TYPI, typus)) {
          return new ParseError('Could not parse Typus', {
            received: typus,
            validValues: TYPI,
            currentRow,
            data,
          })
        }
        zauber.typus = typus
        break
      case 'Schwierigkeit':
        const schwierigkeit = parseZauberschwierigkeit(currentRightSide)
        if (schwierigkeit instanceof ParseError) {
          return new ParseError('Could not parse Schwierigkeit', {
            cause: schwierigkeit,
            currentRow,
            data,
          })
        }
        zauber.schwierigkeit = schwierigkeit

        break
      case 'Kosten':
        const kosten = parseFokusKosten(currentRightSide)
        if (kosten instanceof ParseError) {
          return new ParseError('Could not parse Kosten', {
            cause: kosten,
            currentRow,
            data,
          })
        }
        zauber.kosten = kosten
        break
      case 'Zauberdauer':
        const dauer = parseZeitlänge(currentRightSide)
        if (dauer instanceof ParseError) {
          return new ParseError('Could not parse Zauberdauer', {
            cause: dauer,
            currentRow,
            data,
          })
        }
        zauber.zauberdauer = dauer
        break
      case 'Reichweite':
        const reichweite = parseReichweite(currentRightSide)
        if (reichweite instanceof ParseError) {
          return new ParseError('Could not parse Reichweite', {
            cause: reichweite,
            currentRow,
            data,
          })
        }
        zauber.reichweite = reichweite
        break
      case 'Wirkung':
        break
      case 'Wirkungsdauer':
        break
      case 'Wirkungsbereich':
        break
      case 'Erfolgsgrade':
        break
      case 'None':
        break
    }
  }
  // TODO remove cast
  return zauber as Zauber
}

export function parseAllZauber(data: string[]): Zauber[] {
  const retVal: Zauber[] = []

  return retVal
}
