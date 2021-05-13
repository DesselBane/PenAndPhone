import { CompositionSource } from '@models/Composition'
import { Displayable } from '@models/Displayable'
import { Incrementable, IncrementableImpl } from '@models/Increments'
import { jsonMember, jsonObject } from 'typedjson'
import { ReferenceableBase } from './reference'

@jsonObject(ReferenceableBase.options)
export class Attribute
  extends IncrementableImpl
  implements Incrementable, CompositionSource, Displayable
{
  @jsonMember(String)
  public readonly label: string

  constructor(label: string) {
    super()

    this.label = label
  }
}
