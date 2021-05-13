import { Character } from '@models/character'
import { Displayable } from '@models/Displayable'
import { ReferenceableBase } from '@models/reference'
import { jsonArrayMember, jsonMember, jsonObject } from 'typedjson'
import { storeInstance } from '../store/data-store'

@jsonObject(ReferenceableBase.options)
export class Game extends ReferenceableBase implements Displayable {
  @jsonArrayMember(Character)
  public characters: Character[] = []

  public addCharacter(char: Character): void {
    this.characters.push(char)
    storeInstance.addReference(char)
  }

  public removeCharacter(character: Character): void {
    const charIndex = this.characters.findIndex((x) => character.id === x.id)
    if (charIndex === -1) {
      throw `Could not remove Character(${character.id}) from Game(${this.id}) because it wasn't found.`
    } else {
      this.characters.splice(charIndex, 1)
      storeInstance.removeReference(character)
    }
  }

  @jsonMember(String)
  public label: string

  constructor(label: string) {
    super()

    this.label = label
  }
}
