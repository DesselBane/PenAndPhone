import { Game } from '@models/game'
import { TypedJSON } from 'typedjson'
import { reactive } from '@vue/reactivity'
import { watch } from 'vue'
import { Referenceable } from '@models/reference'

const LOCAL_STORAGE_KEY = 'pap.store.data'

export class DataStore {
  public _referenceStore = new Map<string, object>()

  public games: Game[] = []

  public load() {
    const json = localStorage.getItem(LOCAL_STORAGE_KEY)
    this.games = TypedJSON.parseAsArray(json, Game) || []
    watch(
      () => this.games,
      () => {
        this.save()
      },
      {
        deep: true,
      }
    )
  }
  public save() {
    this._saveToLocalStorage()
  }

  private _saveToLocalStorage(): void {
    const json = TypedJSON.stringifyAsArray(this.games, Game)
    localStorage.setItem(LOCAL_STORAGE_KEY, json)
  }

  public addGame(game: Game) {
    this.games.push(game)
    this.addReference(game)
  }
  public removeGame(game: Game) {
    const gameIndex = this.games.findIndex((x) => x.id === game.id)

    if (gameIndex === -1) {
      throw `Could not remove Game(${game.id}) from dataStore because it wasn't found.`
    } else {
      this.games.splice(gameIndex, 1)
      this.removeReference(game)
    }
  }

  public addReference(value: Referenceable) {
    this._referenceStore.set(value.id, value)
  }
  public getReference(id: string | Referenceable): object | undefined {
    if (typeof id !== 'string') {
      id = id.id
    }
    return this._referenceStore.get(id)
  }
  public removeReference(id: string | Referenceable) {
    if (typeof id !== 'string') {
      id = id.id
    }
    this._referenceStore.delete(id)
  }
}

export const storeInstance = reactive(new DataStore())
storeInstance.load()
