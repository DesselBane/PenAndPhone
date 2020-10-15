import { serializableRefArrayOptions } from '@helper/serializerOptions'
import { Game } from '@models/game'
import { jsonArrayMember, jsonMember, jsonObject, TypedJSON } from 'typedjson'
import { ref, Ref } from '@vue/reactivity'
import { watch } from 'vue'

const LOCAL_STORAGE_KEY = 'pap.store.data'

@jsonObject({ onDeserialized: 'initialize' })
export class DataStore {
  @jsonMember({ constructor: Number })
  private gameIdSeed = 0

  @jsonArrayMember(Game, serializableRefArrayOptions())
  public readonly games: Ref<Game[]> = ref([])

  private initialize(): void {
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
    console.log('save')
    const serializer = new TypedJSON(DataStore)
    localStorage.setItem(LOCAL_STORAGE_KEY, serializer.stringify(this))
  }

  public addGame(game: Game) {
    game.id = this.gameIdSeed++
    this.games.value.push(game)
  }
}

function loadDataStore() {
  const store = new TypedJSON(DataStore).parse(
    localStorage.getItem(LOCAL_STORAGE_KEY)
  )
  return store != null ? store : new DataStore()
}

export const storeInstance = loadDataStore()
