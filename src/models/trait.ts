import { Taggable } from '@models/tags'
import { jsonArrayMember, jsonMember, jsonObject } from 'typedjson'

@jsonObject
export class Trait implements Taggable {
  @jsonMember
  public name: string = ''

  @jsonMember
  public value: string = ''

  @jsonArrayMember(String)
  public tags: string[] = []

  constructor(name = '', value = '', ...tags: string[]) {
    this.name = name
    this.value = value
    this.tags = tags
  }
}
