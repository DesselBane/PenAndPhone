import { CompositionSource } from '@models/Composition/CompositionSource'
import { ReferenceableBase } from '@models/Reference'
import { jsonMember, jsonObject } from 'typedjson'

@jsonObject(ReferenceableBase.options)
export class StaticCompositionSource
  extends ReferenceableBase
  implements CompositionSource
{
  @jsonMember(Number)
  public readonly currentValue: number

  constructor(value: number) {
    super()
    this.currentValue = value
  }
}
