import { Displayable } from '@models/Displayable'
import { jsonMember, jsonObject } from 'typedjson'

@jsonObject
export class Trait implements Displayable {
  @jsonMember(String)
  public name: string

  @jsonMember(String)
  public value: string

  public get label(): string {
    return this.name
  }

  constructor(name: string, value?: string) {
    this.name = name
    this.value = value || ''
  }
}
