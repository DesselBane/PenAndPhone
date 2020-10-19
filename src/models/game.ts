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

  public removeCharacter(character: Character) {
    const charIndex = this.characters.findIndex((x) => character.id === x.id)
    if (charIndex === -1) {
      throw `Could not remove Character(${character.id}) from Game(${this.id}) because it wasn't found.`
    } else {
      this.characters.splice(charIndex, 1)
    }
  }

  public getCharById(charId: number): Character | null {
    return this.characters?.find((x) => x.id === charId) || null
  }
}
