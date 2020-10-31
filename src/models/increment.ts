import { Calculated } from '@models/calculated'
import { Referenceable, ReferenceableBase } from '@models/reference'
import { jsonMember, jsonObject } from 'typedjson'

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
