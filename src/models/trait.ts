import { jsonMember, jsonObject } from 'typedjson'

@jsonObject
export class Trait {
  @jsonMember
  public name: string = ''

  @jsonMember
  public value: string = ''

  constructor(name = '', value = '') {
    this.name = name
    this.value = value
  }
}
