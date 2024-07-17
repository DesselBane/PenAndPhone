import { describe, expect, it } from 'vitest'
import {
  classify,
  FokusKosten,
  ParseError,
  parseFokusKosten,
  parseZauberverstärkung,
  parseZeitlänge,
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

  describe('FokusKosten', () => {
    // TODO K1V1 should be valid
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
  })
})

/**

Schulen: Erkenntnis 1, Schutz 1
Typus: Wahrnehmung
Schwierigkeit: 18
Kosten: 4V1
Zauberdauer: 2 Ticks
Reichweite: Zauberer
Wirkung: Der Zauberer wird alarmiert, wenn
eines oder mehrere Wesen der Größenklasse 2 oder höher den Wirkungsbereich betritt. Er vermag dabei keinen genauen Ort zu
bestimmen, sondern lediglich die pure Anwesenheit festzustellen, ebenso wenig kann
er Angaben zur Anzahl machen. Es ist möglich, bis zu zehn bestimmte Wesen seiner
Wahl von der Alarmierung auszunehmen.
Wirkungsdauer: 6 Stunden
Wirkungsbereich: 5 m
Erfolgsgrade:
• Auslösezeit, Erschöpfter Fokus, Verstärken
(s. u.), Verzehrter Fokus, Wirkungsbereich,
Wirkungsdauer
• 1 EG (Kosten +1V1): Der Zauberer weiß, in
welcher Richtung sich die Wesen befinden,
ohne jedoch die Entfernung zu kennen.
 *
 *
 */
