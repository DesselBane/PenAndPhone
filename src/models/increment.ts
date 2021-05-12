import { computedProp } from '@helper/ReactiveBase'
import { Calculated } from '@models/calculated'
import { Referenceable, ReferenceableBase } from '@models/reference'
import { storeInstance } from '@store/data-store'
import { jsonArrayMember, jsonMember, jsonObject } from 'typedjson'

export interface Increment extends Referenceable {
  readonly timestamp: number
  readonly amount: number
}

@jsonObject(ReferenceableBase.options)
export class IncrementImpl extends ReferenceableBase implements Increment {
  @jsonMember
  public readonly amount: number
  @jsonMember
  public readonly timestamp: number = Date.now()

  constructor(amount = 1) {
    super()
    this.amount = amount
  }
}

export interface Incrementable extends Referenceable, Calculated {
  readonly increments: Increment[]
  addIncrement(amount: number): Increment
  removeIncrement(id?: string): boolean
}

@jsonObject(ReferenceableBase.options)
export class IncrementableImpl
  extends ReferenceableBase
  implements Incrementable
{
  @jsonArrayMember(IncrementImpl)
  protected _increments: Increment[] = []

  public get increments(): Increment[] {
    return this._increments
  }

  @computedProp
  public get currentValue() {
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
