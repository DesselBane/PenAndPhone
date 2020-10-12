import { Game } from '@models/game'

describe('Game', () => {
  it('creates a new unique readonly id', () => {
    const games = [new Game(), new Game(), new Game(), new Game(), new Game()]

    const ids = [...new Set(games.map((game) => game.id))]
    expect(ids.length).toBe(games.length)
  })
})
