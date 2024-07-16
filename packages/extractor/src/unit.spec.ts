import { describe, expect, it } from 'vitest'
import {
  FokusKosten,
  ParseError,
  parseFokusKosten,
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
    it.each<{
      title: string
      input: string
      output?: FokusKosten
      error?: true
    }>([
      {
        title: 'parses erschöpft',
        input: '1',
        output: [1, 0, 0],
      },
      {
        title: 'parses kanalisiert',
        input: 'K11',
        output: [0, 11, 0],
      },
      {
        title: 'parses erschöpft + verzehrt',
        input: '4V2',
        output: [2, 0, 2],
      },
      {
        title: 'parses kanalisiert + verzehrt',
        input: 'K44V22',
        output: [0, 22, 22],
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
})
