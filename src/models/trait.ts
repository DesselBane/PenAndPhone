import { TaggableBase } from '@models/tags'
import { jsonMember, jsonObject } from 'typedjson'

@jsonObject
export class Trait extends TaggableBase {
  @jsonMember
  public name: string = ''

  @jsonMember
  public value: string = ''

  constructor(name = '', value = '', ...tags: string[]) {
    super()
    this.name = name
    this.value = value
    this.tags = tags
  }
}
