import { Character } from '@models/character'
import { ReferenceableBase } from '@models/reference'
import { jsonArrayMember, jsonObject } from 'typedjson'
import { storeInstance } from '../store/data-store'

@jsonObject(ReferenceableBase.options)
export class Game extends ReferenceableBase {
  @jsonArrayMember(Character)
  public characters: Character[] = []

  public addCharacter(char: Character) {
    this.characters.push(char)
    storeInstance.addReference(char)
  }

  public removeCharacter(character: Character) {
    const charIndex = this.characters.findIndex((x) => character.id === x.id)
    if (charIndex === -1) {
      throw `Could not remove Character(${character.id}) from Game(${this.id}) because it wasn't found.`
    } else {
      this.characters.splice(charIndex, 1)
      storeInstance.removeReference(character)
    }
  }
}
