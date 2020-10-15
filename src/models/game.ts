import { Character } from '@models/character'
import { jsonArrayMember, jsonMember, jsonObject } from 'typedjson'

@jsonObject
export class Game {
  @jsonMember
  private charIdSeed: number = 0

  @jsonMember
  public id: number = -1

  @jsonMember
  public name: string = ''

  @jsonArrayMember(Character)
  public characters: Character[] = []

  public addCharacter(char: Character) {
    char.id = this.charIdSeed++
    this.characters.push(char)
  }
}
