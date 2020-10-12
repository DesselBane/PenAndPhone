import { Character } from '@models/character'
import { reactive, ref, Ref } from '@vue/reactivity'

export class Game {
  private static idSeed = 0
  public readonly id: number
  public name: Ref<string | null> = ref(null)
  public characters: Character[] = reactive([])

  constructor() {
    this.id = Game.idSeed++
  }
}
