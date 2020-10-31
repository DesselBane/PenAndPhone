import { CompositionSource } from '@models/composable'
import { Increment, Incrementable, IncrementImpl } from '@models/increment'
import { computed, reactive, nextTick } from 'vue'
import { jsonArrayMember, jsonObject } from 'typedjson'
import { storeInstance } from '../store/data-store'
import { ReferenceableBase } from './reference'

@jsonObject(ReferenceableBase.options)
export class Attribute extends ReferenceableBase
  implements Incrementable, CompositionSource {
  @jsonArrayMember(IncrementImpl)
  private _increments: Increment[] = []

  public get increments(): Increment[] {
    return this._increments
  }

  public currentValue = 0

  constructor(label = '') {
    super(label)

    const that = reactive(this) as Attribute

    nextTick(() => {
      that.currentValue = (computed(() =>
        that._increments.reduce(
          (previousValue, { amount }) => previousValue + amount,
          0
        )
      ) as unknown) as number
    })

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
