import { Attribute } from '@models/attribute'
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
