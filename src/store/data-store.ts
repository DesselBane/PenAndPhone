import { Game } from '@models/game'
import { Referenceable } from '@models/reference'
import { reactive, UnwrapNestedRefs } from '@vue/reactivity'
import { TypedJSON } from 'typedjson'

const LOCAL_STORAGE_KEY: string = 'pap.store.data'

export class DataStore {
  public _referenceStore: Map<string, Referenceable> = new Map<
    string,
    Referenceable
  >()

  public games: Game[] = []
  private _lastSave: number = Date.now()

  public get lastSave(): number {
    return this._lastSave
  }

  public load(): void {
    this._referenceStore.clear()
    const json: string | null = localStorage.getItem(LOCAL_STORAGE_KEY)
    this.games = TypedJSON.parseAsArray(json, Game) || []
  }
  public save(): void {
    this._lastSave = Date.now()
    this._saveToLocalStorage()
  }

  private _saveToLocalStorage(): void {
    const json: string = TypedJSON.stringifyAsArray(this.games, Game)
    localStorage.setItem(LOCAL_STORAGE_KEY, json)
  }

  public addGame(game: Game): void {
    this.games.push(game)
    this.addReference(game)
  }
  public removeGame(game: Game): void {
    const gameIndex: number = this.games.findIndex(
      (x: Game): boolean => x.id === game.id
    )

    if (gameIndex === -1) {
      throw `Could not remove Game(${game.id}) from dataStore because it wasn't found.`
    } else {
      this.games.splice(gameIndex, 1)
      this.removeReference(game)
    }
  }

  public addReference(value: Referenceable): void {
    this._referenceStore.set(value.id, value)
  }
  public getReference(id: string | Referenceable): Referenceable | undefined {
    if (typeof id !== 'string') {
      id = id.id
    }
    return this._referenceStore.get(id)
  }
  public removeReference(id: string | Referenceable): void {
    if (typeof id !== 'string') {
      id = id.id
    }
    this._referenceStore.delete(id)
  }
}

export const storeInstance: UnwrapNestedRefs<DataStore> = reactive(
  new DataStore()
)
storeInstance.load()
