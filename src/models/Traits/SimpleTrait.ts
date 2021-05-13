import { Trait } from '@models/Traits/Trait'
import { jsonMember, jsonObject } from 'typedjson'

@jsonObject
export class SimpleTrait implements Trait<string> {
  @jsonMember(String)
  public readonly label: string

  @jsonMember(String)
  public value: string

  constructor(label: string, value?: string) {
    this.label = label
    this.value = value || ''
  }
}
