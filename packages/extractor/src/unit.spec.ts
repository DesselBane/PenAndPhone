import { describe, expect, it } from 'vitest'
import { ParseError, parseZeitlänge } from './units.js'

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
        input: '2 Stunden',
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
        title: 'doesnt accept non string',
        input: [2, 3],
        error: true,
        response: null,
        errorMessage: 'Can only parse string',
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
})
