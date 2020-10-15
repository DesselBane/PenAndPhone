import { Character } from '@models/character'
import { jsonArrayMember, jsonMember, jsonObject } from 'typedjson'

@jsonObject
export class Game {
  @jsonMember
  public id: number = -1

  @jsonMember
  public name: string = ''

  @jsonArrayMember(Character)
  public characters: Character[] = []
}
