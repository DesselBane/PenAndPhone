import { Ref, ref } from '@vue/reactivity'

export class Character {
  private static idSeed = 0
  public readonly id: number
  public readonly name: Ref<string> = ref('')

  constructor() {
    this.id = Character.idSeed++
  }
}
