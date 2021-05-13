import { ReferenceableBase } from '@models/Reference'
import { Trait } from '@models/Traits/Trait'
import { jsonMember, jsonObject } from 'typedjson'

@jsonObject(ReferenceableBase.options)
export class SimpleTrait extends ReferenceableBase implements Trait {
  @jsonMember(String)
  public readonly label: string

  @jsonMember(String)
  public value: string

  constructor(label: string, value?: string) {
    super()
    this.label = label
    this.value = value || ''
  }
}
