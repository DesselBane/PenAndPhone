import { Character } from '@models/character'
import { jsonArrayMember, jsonMember, jsonObject } from 'typedjson'

@jsonObject
export class Game {
  @jsonMember({ constructor: Number })
  public id: number = -1

  @jsonMember({ constructor: String })
  public name: string = ''

  @jsonArrayMember(Character)
  public characters: Character[] = []
}
