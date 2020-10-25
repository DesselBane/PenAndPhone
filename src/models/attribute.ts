import { Increment, Incrementable, IncrementImpl } from '@models/increment'
import { Taggable } from '@models/tags'
import { computed, ComputedRef, reactive } from 'vue'
import { jsonArrayMember, jsonMember, jsonObject } from 'typedjson'
import { storeInstance } from '../store/data-store'
import { ReferenceableBase } from './reference'

@jsonObject(ReferenceableBase.options)
export class Attribute extends ReferenceableBase
  implements Taggable, Incrementable {
  @jsonArrayMember(String)
  public tags: string[] = []
  @jsonMember
  public parentId: string = ''
  @jsonMember
  public label: string = ''

  @jsonArrayMember(IncrementImpl)
  private _increments: Increment[] = []

  public get increments(): Increment[] {
    return this._increments
  }

  public currentValue: ComputedRef<number> = computed(() => 0)

  constructor(label = '') {
    super()

    const that = reactive(this) as Attribute

    that.currentValue = computed(() =>
      that._increments.reduce(
        (previousValue, { amount }) => previousValue + amount,
        0
      )
    )

    that.label = label

    return that
  }

  public addIncrement(amount = 1): Increment {
    const increment = new IncrementImpl(amount)
    this._increments.push(increment)
    storeInstance.addReference(increment)

    return increment
  }

  public removeIncrement(id?: string): boolean {
    const incrementIndex =
      id === undefined
        ? this._increments.length - 1
        : this._increments.findIndex((x) => x.id === id)

    if (incrementIndex === -1) {
      return false
    } else {
      storeInstance.removeReference(this._increments[incrementIndex])
      this._increments.splice(incrementIndex, 1)
      return true
    }
  }
}
