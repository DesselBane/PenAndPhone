import { Increment } from '@models/Increments/increment'
import { Incrementable } from '@models/Increments/Incrementable'
import { IncrementImpl } from '@models/Increments/IncrementImpl'
import { ReferenceableBase } from '@models/reference'
import { storeInstance } from '@store/data-store'
import { jsonArrayMember, jsonObject } from 'typedjson'

@jsonObject(ReferenceableBase.options)
export class IncrementableImpl
  extends ReferenceableBase
  implements Incrementable
{
  @jsonArrayMember(() => IncrementImpl)
  protected _increments: Increment[] = []

  public get increments(): Increment[] {
    return this._increments
  }

  public get currentValue(): number {
    return this.increments.reduce(
      (previousValue, { amount }) => previousValue + amount,
      0
    )
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
