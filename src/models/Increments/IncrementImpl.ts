import { Increment } from '@models/Increments/increment'
import { ReferenceableBase } from '@models/reference'
import { jsonMember, jsonObject } from 'typedjson'

@jsonObject(ReferenceableBase.options)
export class IncrementImpl extends ReferenceableBase implements Increment {
  @jsonMember(Number)
  public readonly amount: number
  @jsonMember(Number)
  public readonly timestamp: number = Date.now()

  constructor(amount = 1) {
    super()
    this.amount = amount
  }
}
