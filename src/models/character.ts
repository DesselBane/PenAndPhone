import { DefaultTags } from '@models/tags'
import { jsonArrayMember, jsonMember, jsonObject } from 'typedjson'
import { Trait } from './trait'

@jsonObject({
  initializer: () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new Character(true)
  },
})
export class Character {
  @jsonMember({ constructor: Number })
  public id: number = -1

  @jsonMember
  public name: string = ''

  @jsonArrayMember(Trait)
  public traits: Trait[] = []

  constructor(skipHardcodedSetup = false) {
    if (!skipHardcodedSetup) {
      this._hardcodedSetup()
    }
  }

  private _hardcodedSetup() {
    this.traits = [
      'Ausbildung',
      'Kultur',
      'Haarfarbe',
      'Augenfarbe',
      'Abstammung',
      'Geschlecht',
      'Körpergröße',
      'Gewicht',
      'Geburtsort',
      'Schwächen',
      'Sprachen',
      'Kulturkunde',
    ].map((name) => new Trait(name, '', DefaultTags.generelles))
  }
}
