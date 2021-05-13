import { CompositionSource } from '@models/Composition/CompositionSource'
import { ReferenceableBase } from '@models/Reference'
import { jsonMember, jsonObject } from 'typedjson'

@jsonObject(ReferenceableBase.options)
export class StaticCompositionSource
  extends ReferenceableBase
  implements CompositionSource<number>
{
  @jsonMember(Number)
  public readonly value: number

  constructor(value: number) {
    super()
    this.value = value
  }
}
