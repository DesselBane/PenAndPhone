import { Attribute } from '@models/attribute'
import { Modification } from '@models/modification'
import { ReferenceableBase } from '@models/reference'
import { DefaultTags } from '@models/tags'
import { jsonArrayMember, jsonMember, jsonObject } from 'typedjson'
import { storeInstance } from '../store/data-store'
import { Trait } from './trait'

@jsonObject({
  ...ReferenceableBase.options,
  initializer: () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new Character(true)
  },
})
export class Character extends ReferenceableBase {
  @jsonMember
  public name: string = ''

  @jsonArrayMember(Trait)
  public traits: Trait[] = []

  @jsonArrayMember(Attribute)
  public readonly attributes: Attribute[] = []

  @jsonArrayMember(Modification)
  public readonly modifications: Modification[] = []

  constructor(skipHardcodedSetup = false) {
    super()

    if (!skipHardcodedSetup) {
      this._hardcodedSetup()
    }
  }

  public addAttribute(attr: Attribute) {
    attr.parentId = this.id
    storeInstance.addReference(attr)
    this.attributes.push(attr)
  }
  public addModification(mod: Modification) {
    //TODO check if target is valid
    storeInstance.addReference(mod)
    this.modifications.push(mod)
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

    const fooAttr = new Attribute()
    fooAttr.tags.push(DefaultTags.attribute)
    this.addAttribute(fooAttr)

    const mod1 = new Modification()
    mod1.targetId = fooAttr.id
    mod1.amount = 5
    this.addModification(mod1)

    const mod2 = new Modification()
    mod2.targetId = fooAttr.id
    mod2.amount = -8
    this.addModification(mod2)
  }
}
