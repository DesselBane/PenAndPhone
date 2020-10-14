import { Character } from '@models/character'
import { reactive, ref, Ref } from '@vue/reactivity'
import { jsonArrayMember, jsonMember, jsonObject } from 'typedjson'
import {
  serializableReactiveArrayOptions,
  serializableRefOptions,
} from '@helper/serializerOptions'

@jsonObject
export class Game {
  public static idSeed = 0

  @jsonMember({ constructor: Number })
  public readonly id: number

  @jsonMember(serializableRefOptions(String))
  public name: Ref<string | null> = ref(null)

  @jsonArrayMember(Character, serializableReactiveArrayOptions())
  public characters: Character[] = reactive([])

  constructor() {
    this.id = Game.idSeed++
  }
}
