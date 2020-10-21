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
  public removeModification(mod: Modification): boolean {
    const modIndex = this.modifications.findIndex((x) => x.id === mod.id)
    if (modIndex === -1) {
      return false
    }
    this.modifications.splice(modIndex, 1)
    storeInstance.removeReference(mod)
    return true
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

    const attributes = [
      'Ausstrahlung',
      'Beweglichkeit',
      'Intuition',
      'Konsitution',
      'Mystik',
      'Stärke',
      'Verstand',
      'Willenskraft',
    ]

    attributes.forEach((attrName) => {
      const attr = new Attribute()
      attr.tags.push(DefaultTags.attribute)
      attr.label = attrName
      this.addAttribute(attr)
    })
  }
}
