import { describe, expect, it } from 'vitest'
import {
  classify,
  FokusKosten,
  HELDENGRADE,
  ParseError,
  parseFokusKosten,
  parseReichweite,
  parseZauber,
  parseZauberschulvorrausetzung,
  parseZauberschwierigkeit,
  parseZauberverstärkung,
  parseZeitlänge,
  Reichweite,
  REICHWEITE_EINHEITEN,
  SIMPLE_REICHWEITEN,
  SIMPLE_ZAUBERSCHWIERIGKEITEN,
  TYPI,
  Zauber,
  Zauberschulvorrausetzung,
  Zeitlänge,
} from './units.js'

describe('units', () => {
  describe('zeitlänge', () => {
    it.each([
      {
        title: 'works',
        input: '2 ticks',
        error: false,
        response: [2, 'ticks'],
        errorMessage: null,
      },
      {
        title: 'normalizes',
        input: ' 2 Stunden  ',
        error: false,
        response: [2, 'stunden'],
        errorMessage: null,
      },
      {
        title: 'only accepts integers',
        input: '2.2 ticks',
        error: true,
        response: null,
        errorMessage: 'integer',
      },
      {
        title: 'doesnt work with to few spaces',
        input: '2ticks',
        error: true,
        response: null,
        errorMessage: '"<number><space><zeiteinheit>"',
      },
      {
        title: 'doesnt work with to many spaces (at once)',
        input: '2  ticks',
        error: true,
        response: null,
        errorMessage: '"<number><space><zeiteinheit>"',
      },
      {
        title: 'doesnt accept string in first place',
        input: 'ticks 2',
        error: true,
        response: null,
        errorMessage: '"<number><space><zeiteinheit>"',
      },
      {
        title: 'doesnt accept non zeiteinheit',
        input: '2 tomaten',
        error: true,
        response: null,
        errorMessage: '"<number><space><zeiteinheit>"',
      },
      {
        title: 'doesnt accept string after number',
        input: '2tomaten ticks',
        error: true,
        response: null,
        errorMessage: '"<number><space><zeiteinheit>"',
      },
    ])('$title', ({ input, error, response, errorMessage }) => {
      const result = parseZeitlänge(input)

      if (error) {
        expect(result).toBeInstanceOf(ParseError)
        expect((result as ParseError).message).toContain(errorMessage)
      } else {
        expect(result).toEqual(response)
      }
    })
  })

  describe('schwierigkeit', () => {
    it.each<{
      title: string
      input: string
      output: ReturnType<typeof parseZauberschwierigkeit>
    }>([
      { title: 'Good: number', input: '18', output: 18 },
      {
        title: 'Good: KV',
        input: 'Körperlicher Widerstand des Ziels',
        output: 'Körperlicher Wiederstand',
      },
      {
        title: 'Good: GV',
        input: 'Geistiger Widerstand des Ziels',
        output: 'Geistiger Wiederstand',
      },
      {
        title: 'Good: VTD',
        input: 'Verteidigung des Ziels',
        output: 'Verteidigung',
      },
      {
        title: 'Bad: random string',
        input: 'tomato des Ziels',
        output: new ParseError(
          `Data was neither a number nor included it a valid value.`,
          {
            data: 'tomato des Ziels',
            validValues: SIMPLE_ZAUBERSCHWIERIGKEITEN,
          }
        ),
      },
      {
        title: 'Bad: string attached to number',
        input: '18tomato',
        output: new ParseError(
          `Data was neither a number nor included it a valid value.`,
          {
            data: '18tomato',
            validValues: SIMPLE_ZAUBERSCHWIERIGKEITEN,
          }
        ),
      },
    ])('$title: $input', ({ input, output }) => {
      expect(parseZauberschwierigkeit(input)).toEqual(output)
    })
  })

  describe('reichweite', () => {
    it.each<{
      title: string
      input: string
      output: ReturnType<typeof parseReichweite>
    }>([
      { title: 'Good: number', input: '18 meter', output: [18, 'meter'] },
      {
        title: 'Good: Zauberer',
        input: 'Zauberer',
        output: 'Zauberer',
      },
      {
        title: 'Good: Behrührung',
        input: 'Behrührung',
        output: 'Behrührung',
      },
      {
        title: 'Bad: random string',
        input: 'tomato',
        output: new ParseError(
          `Data did not match the format "<number><space><einheit>" nor was it a valid value.`,
          {
            data: 'tomato meter',
            validValues: SIMPLE_REICHWEITEN,
            validEinheiten: REICHWEITE_EINHEITEN,
          }
        ),
      },
      {
        title: 'Bad: string attached to number',
        input: '18tomato meter',
        output: new ParseError(
          `Data did not match the format "<number><space><einheit>" nor was it a valid value.`,
          {
            data: '18tomato meter',
            validValues: SIMPLE_REICHWEITEN,
            validEinheiten: REICHWEITE_EINHEITEN,
          }
        ),
      },
      {
        title: 'Bad: invalid unit',
        input: '18 tomato',
        output: new ParseError(
          `Data did not match the format "<number><space><einheit>" nor was it a valid value.`,
          {
            data: '18 tomato',
            validValues: SIMPLE_REICHWEITEN,
            validEinheiten: REICHWEITE_EINHEITEN,
          }
        ),
      },
    ])('$title: $input', ({ input, output }) => {
      expect(parseReichweite(input)).toEqual(output)
    })
  })

  describe('zauberschulvorraussetzung', () => {
    it.each<{
      title: string
      input: string
      output: ReturnType<typeof parseZauberschulvorrausetzung>
    }>([
      {
        title: 'Good: Simple',
        input: 'Erkenntnis 1',
        output: [['Erkenntnis', 1]],
      },
      {
        title: 'Good: Double',
        input: 'Erkenntnis 1, Schutz 1',
        output: [
          ['Erkenntnis', 1],
          ['Schutz', 1],
        ],
      },
      {
        title: 'Good: Whitespasces',
        input: '  Erkenntnis  1,  Schutz  1   ',
        output: [
          ['Erkenntnis', 1],
          ['Schutz', 1],
        ],
      },
      {
        title: 'Bad: Unknown schule',
        input: 'Tomato 1',
        output: new ParseError(
          'Unknown schule: "Tomato" detected in "Tomato 1"'
        ),
      },
      {
        title: 'Bad: Not an integer',
        input: 'Erkenntnis 1.5',
        output: new ParseError(
          `Invalid Heldengrad received: "1.5" valid values are: "${HELDENGRADE}" in "Erkenntnis 1.5"`
        ),
      },
      {
        title: 'Bad: Not a valid heldengrad',
        input: 'Erkenntnis 10',
        output: new ParseError(
          `Invalid Heldengrad received: "10" valid values are: "${HELDENGRADE}" in "Erkenntnis 10"`
        ),
      },
      {
        title: 'Bad: string attached to number',
        input: 'Erkenntnis 2tomatos',
        output: new ParseError(
          `Invalid Heldengrad received: "2tomatos" valid values are: "${HELDENGRADE}" in "Erkenntnis 2tomatos"`
        ),
      },
    ])('$title: $input', ({ input, output }) => {
      expect(parseZauberschulvorrausetzung(input)).toEqual(output)
    })
  })

  describe('FokusKosten', () => {
    it.each<{
      title: string
      input: string
      output?: FokusKosten
      error?: true
    }>([
      {
        title: 'parses erschöpft',
        input: '1',
        output: [1, 0, false],
      },
      {
        title: 'parses kanalisiert',
        input: 'K11',
        output: [11, 0, true],
      },
      {
        title: 'parses erschöpft + verzehrt',
        input: '4V2',
        output: [4, 2, false],
      },
      {
        title: 'parses kanalisiert + verzehrt',
        input: 'K44V22',
        output: [44, 22, true],
      },
      {
        title: 'error on negative erschöpft',
        input: '4V8',
        error: true,
      },
      {
        title: 'error on invalid string',
        input: 'tomato',
        error: true,
      },
      {
        title: 'error on string attached to number',
        input: '1tomatoV1',
        error: true,
      },
    ])('$title', ({ input, output, error }) => {
      const result = parseFokusKosten(input)

      if (output != null) {
        expect(result).toEqual(output)
      }

      if (error === true) {
        expect(result).toBeInstanceOf(ParseError)
      }
    })
  })

  describe('Erfolgsgrade', () => {
    it.each<{
      title: string
      input: string
      output: ReturnType<typeof parseZauberverstärkung>
    }>([
      {
        title: 'Good: all, Verstärken single line',
        input:
          '• Auslösezeit, Erschöpfter Fokus, Reichweite, Verstärken (s. u.), Verzehrter Fokus• 1 EG (Kosten +1V1): Das Ziel erhält den Zustand Geblendet 2.',
        output: [
          ['Auslösezeit'],
          ['Erschöpfter Fokus'],
          ['Reichweite'],
          ['Verzehrter Fokus'],
          [
            'Verstärken',
            1,
            [1, 1, false],
            'Das Ziel erhält den Zustand Geblendet 2.',
          ],
        ],
      },
      {
        title: 'Good: all, Verstärken double line',
        input:
          '• Auslösezeit, Erschöpfter Fokus, Reichweite, Verstärken (s. u.), Verzehrter Fokus• 4 EG (Kosten +1V1): Die Hand leuchtet nicht so hell wie eine Fackel, sondern so hell wie ein Lagerfeuer. Der Schaden erhöht sich um 2 Punkte echten Feuerschaden.',
        output: [
          ['Auslösezeit'],
          ['Erschöpfter Fokus'],
          ['Reichweite'],
          ['Verzehrter Fokus'],
          [
            'Verstärken',
            4,
            [1, 1, false],
            'Die Hand leuchtet nicht so hell wie eine Fackel, sondern so hell wie ein Lagerfeuer. Der Schaden erhöht sich um 2 Punkte echten Feuerschaden.',
          ],
        ],
      },
      {
        title: 'Good: no Verstärken',
        input: '• Auslösezeit, Erschöpfter Fokus, Reichweite, Verzehrter Fokus',
        output: [
          ['Auslösezeit'],
          ['Erschöpfter Fokus'],
          ['Reichweite'],
          ['Verzehrter Fokus'],
        ],
      },
      {
        title: 'Good: only Verstärken',
        input:
          '• Verstärken (s. u.)• 1 EG (Kosten +K1V1): Das Ziel erhält den Zustand Geblendet 2.',
        output: [
          [
            'Verstärken',
            1,
            [1, 1, true],
            'Das Ziel erhält den Zustand Geblendet 2.',
          ],
        ],
      },
      {
        title: 'Bad: invalid Zauberverstärkungsart',
        input: '• Auslösezeit, Erschöpfter Fokus, Tomato, Verzehrter Fokus',
        output: new ParseError(
          'Unknown verstärkung: "Tomato" within • Auslösezeit, Erschöpfter Fokus, Tomato, Verzehrter Fokus'
        ),
      },
      {
        title: 'Bad: Verstärken without description',
        input:
          '• Auslösezeit, Erschöpfter Fokus, Verstärken (s. u.), Verzehrter Fokus',
        output: new ParseError(
          'Found "Verstärken" but not its description. Data: • Auslösezeit, Erschöpfter Fokus, Verstärken (s. u.), Verzehrter Fokus'
        ),
      },
    ])('$title', ({ input, output }) => {
      const result = parseZauberverstärkung(input)

      expect(result).toEqual(output)
    })
  })

  describe('parse Zauber', () => {
    describe('classify', () => {
      it.each<{ input: string; classification: ReturnType<typeof classify> }>([
        {
          input: 'Alarm (Spruch)',
          classification: 'Spruch',
        },
        {
          input: 'Alarm (Ritus)',
          classification: 'Ritus',
        },
        {
          input: 'Schulen: Erkenntnis 1, Schutz 1',
          classification: 'Schulen',
        },
        {
          input: 'Typus: Wahrnehmung',
          classification: 'Typus',
        },
        {
          input: 'Schwierigkeit: 18',
          classification: 'Schwierigkeit',
        },
        {
          input: 'Kosten: 4V1',
          classification: 'Kosten',
        },
        {
          input: 'Zauberdauer: 2 Ticks',
          classification: 'Zauberdauer',
        },
        {
          input: 'Reichweite: Zauberer',
          classification: 'Reichweite',
        },
        {
          input: 'Wirkung: Der Zauberer wird alarmiert, wenn',
          classification: 'Wirkung',
        },
        {
          input: 'Wirkungsdauer: 6 Stunden',
          classification: 'Wirkungsdauer',
        },
        {
          input: 'Wirkungsbereich: 5 m',
          classification: 'Wirkungsbereich',
        },
        {
          input: 'Erfolgsgrade:',
          classification: 'Erfolgsgrade',
        },
        {
          input: '• Auslösezeit, Erschöpfter Fokus, Verstärken',
          classification: 'None',
        },
      ])('$classification: $input', ({ input, classification }) => {
        expect(classify(input)).toBe(classification)
      })
    })

    describe('parse', () => {
      function createTestData() {
        return [
          'Alarm (Spruch)',
          'Schulen: Erkenntnis 1, Schutz 1',
          'Typus: Wahrnehmung',
          'Schwierigkeit: 18',
          'Kosten: 4V1',
          'Zauberdauer: 2 Ticks',
          'Reichweite: Zauberer',
          'Wirkung: Der Zauberer wird alarmiert, wenn',
          'eines oder mehrere Wesen der Größenklasse 2 oder höher den Wirkungsbereich betritt. Er vermag dabei keinen genauen Ort zu',
          'bestimmen, sondern lediglich die pure Anwesenheit festzustellen, ebenso wenig kann',
          'er Angaben zur Anzahl machen. Es ist möglich, bis zu zehn bestimmte Wesen seiner',
          'Wahl von der Alarmierung auszunehmen.',
          'Wirkungsdauer: 6 Stunden',
          'Wirkungsbereich: 5 m',
          'Erfolgsgrade:',
          '• Auslösezeit, Erschöpfter Fokus, Verstärken',
          '(s. u.), Verzehrter Fokus, Wirkungsbereich,',
          'Wirkungsdauer',
          '• 1 EG (Kosten +1V1): Der Zauberer weiß, in',
          'welcher Richtung sich die Wesen befinden,',
          'ohne jedoch die Entfernung zu kennen.',
        ]
      }

      it('Good: Parses Spruch', () => {
        const data = createTestData()
        data[0] = 'Alarm (Spruch)'

        const zauber = parseZauber(data) as Zauber

        expect(zauber).not.toBeInstanceOf(ParseError)
        expect(zauber.name).toBe('Alarm')
        expect(zauber.art).toBe('Spruch')
      })

      it('Good: Parses Ritus', () => {
        const data = createTestData()
        data[0] = 'Tomato Ritus (Ritus)'

        const zauber = parseZauber(data) as Zauber

        expect(zauber).not.toBeInstanceOf(ParseError)
        expect(zauber.name).toBe('Tomato Ritus')
        expect(zauber.art).toBe('Ritus')
      })

      it('Bad: reports inner error in Schulen', () => {
        const data = createTestData()
        data[1] = 'Schulen: Tomato 1, Schutz 1'

        const result = parseZauber(data) as ParseError<ParseError>

        expect(result).toBeInstanceOf(ParseError)
        expect(result.cause).toBeInstanceOf(ParseError)
        expect(result.message).toBe('Could not parse Schulen')
        expect(result.cause!.message).toBe(
          'Unknown schule: "Tomato" detected in "Tomato 1, Schutz 1"'
        )
        expect(result.context!.currentRow).toBe('Schulen: Tomato 1, Schutz 1')
      })

      it('Good: Parses schulen', () => {
        const data = createTestData()
        data[1] = 'Schulen: Erkenntnis 1, Schutz 1'

        const zauber = parseZauber(data) as Zauber

        expect(zauber).not.toBeInstanceOf(ParseError)
        expect(zauber.schulen).toEqual([
          ['Erkenntnis', 1],
          ['Schutz', 1],
        ] satisfies Zauberschulvorrausetzung[])
      })

      it('Bad: reports bad typus', () => {
        const data = createTestData()
        data[2] = 'Typus: Tomato'

        const result = parseZauber(data) as ParseError

        expect(result).toBeInstanceOf(ParseError)
        expect(result.message).toBe('Could not parse Typus')
        expect(result.context!.received).toBe('Tomato')
        expect(result.context!.validValues).toBe(TYPI)
        expect(result.context!.currentRow).toBe('Typus: Tomato')
        expect(result.context!.data).not.toBeUndefined()
      })

      it('Good: parses typus', () => {
        const data = createTestData()
        data[2] = 'Typus: Wahrnehmung'

        const zauber = parseZauber(data) as Zauber

        expect(zauber).not.toBeInstanceOf(ParseError)
        expect(zauber.typus).toBe('Wahrnehmung')
      })

      it('Bad: reports inner error on invalid schiwerigkeit', () => {
        const data = createTestData()
        data[3] = 'Schwierigkeit: 18tomatos'

        const result = parseZauber(data) as ParseError<ParseError>

        expect(result).toBeInstanceOf(ParseError)
        expect(result.cause).toBeInstanceOf(ParseError)
        expect(result.message).toBe('Could not parse Schwierigkeit')
        expect(result.context!.currentRow).toBe('Schwierigkeit: 18tomatos')
        expect(result.context!.data).not.toBeUndefined()
      })

      it('Good: parses schiwerigkeit', () => {
        const data = createTestData()
        data[3] = 'Schwierigkeit: 18'

        const result = parseZauber(data) as Zauber

        expect(result).not.toBeInstanceOf(ParseError)
        expect(result.schwierigkeit).toBe(18)
      })

      it('Bad: reports inner error on invalid kosten', () => {
        const data = createTestData()
        data[4] = 'Kosten: tomato'

        const result = parseZauber(data) as ParseError<ParseError>

        expect(result).toBeInstanceOf(ParseError)
        expect(result.cause).toBeInstanceOf(ParseError)
        expect(result.message).toBe('Could not parse Kosten')
        expect(result.context!.currentRow).toBe('Kosten: tomato')
        expect(result.context!.data).not.toBeUndefined()
      })

      it('Good: parses kosten', () => {
        const data = createTestData()
        data[4] = 'Kosten: 4V1'

        const result = parseZauber(data) as Zauber

        expect(result).not.toBeInstanceOf(ParseError)
        expect(result.kosten).toEqual([4, 1, false] satisfies FokusKosten)
      })

      it('Bad: reports inner error on invalid zauberdauer', () => {
        const data = createTestData()
        data[5] = 'Zauberdauer: 2 Mogs'

        const result = parseZauber(data) as ParseError<ParseError>

        expect(result).toBeInstanceOf(ParseError)
        expect(result.cause).toBeInstanceOf(ParseError)
        expect(result.message).toBe('Could not parse Zauberdauer')
        expect(result.context!.currentRow).toBe('Zauberdauer: 2 Mogs')
        expect(result.context!.data).not.toBeUndefined()
      })

      it('Good: parses zauberdauer', () => {
        const data = createTestData()
        data[5] = 'Zauberdauer: 2 Ticks'

        const result = parseZauber(data) as Zauber

        expect(result).not.toBeInstanceOf(ParseError)
        expect(result.zauberdauer).toEqual([2, 'ticks'] satisfies Zeitlänge)
      })

      it('Bad: reports inner error on invalid reichweite', () => {
        const data = createTestData()
        data[6] = 'Reichweite: Magier'

        const result = parseZauber(data) as ParseError<ParseError>

        expect(result).toBeInstanceOf(ParseError)
        expect(result.cause).toBeInstanceOf(ParseError)
        expect(result.message).toBe('Could not parse Reichweite')
        expect(result.context!.currentRow).toBe('Reichweite: Magier')
        expect(result.context!.data).not.toBeUndefined()
      })

      it('Good: parses reichweite', () => {
        const data = createTestData()
        data[6] = 'Reichweite: Zauberer'

        const result = parseZauber(data) as Zauber

        expect(result).not.toBeInstanceOf(ParseError)
        expect(result.reichweite).toEqual('Zauberer' satisfies Reichweite)
      })
    })
  })
})
