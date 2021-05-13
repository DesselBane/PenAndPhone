import { Ability } from '@models/ability'
import { Attribute } from '@models/attribute'
import { BinaryMathExpression } from '@models/BinaryMathExpression'
import { StaticCompositionSource } from '@models/composable'
import { DerivedValue } from '@models/DerivedValue'
import { Displayable } from '@models/Displayable'
import { MathOperations } from '@models/MathOperations'
import { ReferenceableBase } from '@models/reference'
import { jsonArrayMember, jsonMember, jsonObject } from 'typedjson'
import { storeInstance } from '../store/data-store'
import { SelectableTrait, SimpleTrait } from './trait'

@jsonObject({
  ...ReferenceableBase.options,
  initializer: () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new Character(true)
  },
})
export class Character extends ReferenceableBase implements Displayable {
  public get label(): string {
    return this.name
  }

  @jsonMember(String)
  public name: string = ''

  @jsonArrayMember(SimpleTrait)
  public traits: SimpleTrait[] = []

  @jsonArrayMember(SelectableTrait)
  public selectableTraits: SelectableTrait[] = []

  @jsonArrayMember(Attribute)
  public readonly attributes: Attribute[] = []

  @jsonArrayMember(Ability)
  public readonly abilities: Ability[] = []

  @jsonArrayMember(DerivedValue)
  public readonly derivedValues: DerivedValue[] = []

  constructor(skipHardcodedSetup = false) {
    super()

    if (!skipHardcodedSetup) {
      this._hardcodedSetup()
    }
  }

  public addAttribute(attr: Attribute): void {
    storeInstance.addReference(attr)
    this.attributes.push(attr)
  }
  public removeAttribute(attr: Attribute): boolean {
    const index = this.attributes.findIndex((x) => x.id === attr.id)

    if (index === -1) {
      return false
    }

    this.attributes.splice(index, 1)
    storeInstance.removeReference(attr)
    return true
  }

  public addAbility(ability: Ability): void {
    this.abilities.push(ability)
    storeInstance.addReference(ability)
  }

  public removeAbility(derivedValue: DerivedValue): boolean {
    const index = this.derivedValues.findIndex((x) => x.id === derivedValue.id)

    if (index === -1) {
      return false
    }

    this.abilities.splice(index, 1)
    storeInstance.removeReference(derivedValue)
    return true
  }

  public addDerivedValue(derivedValue: DerivedValue): void {
    this.derivedValues.push(derivedValue)
    storeInstance.addReference(derivedValue)
  }

  public removeDerivedValue(ability: Ability): boolean {
    const index = this.abilities.findIndex((x) => x.id === ability.id)

    if (index === -1) {
      return false
    }

    this.abilities.splice(index, 1)
    storeInstance.removeReference(ability)
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
    ].map((name) => new SimpleTrait(name))

    const race = new SelectableTrait(
      'Rasse',
      ['Alb', 'Gnom', 'Mensch', 'Varg', 'Zwerg'],
      'Alb'
    )

    this.selectableTraits.push(race)

    const attributesNames = [
      'Ausstrahlung',
      'Beweglichkeit',
      'Intuition',
      'Konsitution',
      'Mystik',
      'Stärke',
      'Verstand',
      'Willenskraft',
    ]

    const attributeMap = new Map<string, Attribute>()

    attributesNames.forEach((attrName) => {
      const attr = new Attribute(attrName)
      attributeMap.set(attrName, attr)
      this.addAttribute(attr)
    })

    const abilities = [
      ['Akrobatik', 'Beweglichkeit', 'Stärke'],
      ['Alchemie', 'Mystik', 'Verstand'],
      ['Anführen', 'Ausstrahlung', 'Willenskraft'],
      ['Arkane Kunde', 'Mystik', 'Verstand'],
      ['Athletik', 'Beweglichkeit', 'Stärke'],
      ['Darbietung', 'Ausstrahlung', 'Willenskraft'],
      ['Diplomatie', 'Ausstrahlung', 'Willenskraft'],
      ['Edelhandwerk', 'Intuition', 'Verstand'],
      ['Empathie', 'Intuition', 'Verstand'],
      ['Enstschlossenheit', 'Ausstrahlung', 'Willenskraft'],
      ['Fingerfertigkeit', 'Beweglichkeit', 'Ausstrahlung'],
      ['Geschichten und Mythen', 'Mystik', 'Verstand'],
      ['Handwerk', 'Konsitution', 'Verstand'],
      ['Heilkunde', 'Intuition', 'Verstand'],
      ['Heimlichkeit', 'Beweglichkeit', 'Intuition'],
      ['Jagdkunst', 'Konsitution', 'Verstand'],
      ['Länderkunde', 'Intuition', 'Verstand'],
      ['Naturkunde', 'Intuition', 'Verstand'],
      ['Redegewandheit', 'Ausstrahlung', 'Willenskraft'],
      ['Schlösser und Fallen', 'Beweglichkeit', 'Intuition'],
      ['Schwimmen', 'Konsitution', 'Stärke'],
      ['Seefahrt', 'Beweglichkeit', 'Konsitution'],
      ['Straßenkunde', 'Ausstrahlung', 'Intuition'],
      ['Tierführung', 'Beweglichkeit', 'Ausstrahlung'],
      ['Überleben', 'Intuition', 'Konsitution'],
      ['Wahrnehmung', 'Intuition', 'Willenskraft'],
      ['Zähigkeit', 'Konsitution', 'Willenskraft'],
    ]

    abilities.forEach(([abilityName, attributeName1, attributeName2]) => {
      const ability = new Ability(abilityName)

      ability.addCompositionSource(attributeMap.get(attributeName1))
      ability.addCompositionSource(attributeMap.get(attributeName2))

      this.addAbility(ability)
    })

    const intuition = attributeMap.get('Intuition')
    if (intuition == null) {
      throw new Error('Intuition attribute needed')
    }

    const mystik = attributeMap.get('Mystik')
    if (mystik == null) {
      throw new Error('Mystik attribute needed')
    }

    const willenskraft = attributeMap.get('Willenskraft')
    if (willenskraft == null) {
      throw new Error('Willenskraft attribute needed')
    }

    const initiative = new DerivedValue(
      'Initiative',
      new StaticCompositionSource(10),
      intuition,
      MathOperations.minus
    )
    this.addDerivedValue(initiative)

    const focus = new DerivedValue(
      'Focus',
      new StaticCompositionSource(2),
      new BinaryMathExpression(mystik, willenskraft, MathOperations.plus),
      MathOperations.multiply
    )
    this.addDerivedValue(focus)
  }
}
