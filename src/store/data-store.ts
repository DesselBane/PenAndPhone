import { ref, Ref } from '@vue/reactivity'
import { Game } from '@models/game'
import { Character } from '@models/character'

export class DataStore {
  public readonly games: Ref<Game[]> = ref([])
}

export const storeInstance = new DataStore()

export function createGameMockData() {
  let game = new Game()
  game.name.value = 'Foo'
  storeInstance.games.value.push(game)

  game = new Game()
  game.name.value = 'Bar'
  storeInstance.games.value.push(game)

  game = new Game()
  game.name.value = 'Baz'
  storeInstance.games.value.push(game)
}

export function createCharMockData(gameId: number) {
  const game = storeInstance.games.value.find((x) => x.id === gameId)

  if (game == null) {
    return
  }

  let char = new Character()
  char.name.value = 'Sinthoras'
  game.characters.push(char)

  char = new Character()
  char.name.value = 'Khaldir'
  game.characters.push(char)
}
