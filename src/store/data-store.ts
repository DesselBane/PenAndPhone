import { Character } from '@models/character'
import { Game } from '@models/game'
import { jsonArrayMember, jsonMember, jsonObject, TypedJSON } from 'typedjson'
import { ref, Ref, unref } from '@vue/reactivity'
import { watch } from 'vue'

const LOCAL_STORAGE_KEY = 'pap.store.data'

@jsonObject
export class DataStore {
  @jsonMember
  private gameIdSeed: number = 0

  public games: Ref<Game[]> = ref([])

  @jsonArrayMember(Game, { name: 'games' })
  private get gamesJson(): Game[] {
    return unref(this.games)
  }
  // noinspection JSUnusedLocalSymbols
  private set gamesJson(games: Game[]) {
    this.games.value = games
  }

  constructor() {
    watch(
      () => this.games,
      () => {
        this.saveToLocalStorage()
      },
      {
        deep: true,
      }
    )
  }

  public saveToLocalStorage(): void {
    const serializer = new TypedJSON(DataStore)
    localStorage.setItem(LOCAL_STORAGE_KEY, serializer.stringify(this))
  }

  public addGame(game: Game) {
    game.id = this.gameIdSeed++
    this.games.value.push(game)
  }

  public removeGame(game: Game) {
    game.id = -1
    this.games.value.splice(
      this.games.value.findIndex((x) => x.id === game.id),
      1
    )
  }

  public getGameById(gameId: number): Game | null {
    return this.games.value.find((x) => x.id === gameId) || null
  }

  public getCharById(gameId: number, charId: number): Character | null {
    return (
      this.getGameById(gameId)?.characters?.find((x) => x.id === charId) || null
    )
  }
}

function loadDataStore() {
  const store = new TypedJSON(DataStore).parse(
    localStorage.getItem(LOCAL_STORAGE_KEY)
  )
  return store != null ? store : new DataStore()
}

export const storeInstance = loadDataStore()
