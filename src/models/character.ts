import { jsonMember, jsonObject } from 'typedjson'

@jsonObject
export class Character {
  @jsonMember({ constructor: Number })
  public id: number = -1

  @jsonMember
  public name: string = ''
}
