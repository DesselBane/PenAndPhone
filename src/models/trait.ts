import { jsonMember, jsonObject } from 'typedjson'

@jsonObject
export class Trait {
  @jsonMember(String)
  public name: string = ''

  @jsonMember(String)
  public value: string = ''

  constructor(name = '', value = '') {
    this.name = name
    this.value = value
  }
}
