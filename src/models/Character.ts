import { Ability } from '@models/ability'
import { Attribute } from '@models/attribute'
import { BinaryMathExpression } from '@models/BinaryMathExpression'
import { StaticCompositionSource } from '@models/Composition'
import { CalculatedDerivedValue, DerivedValue } from '@models/DerivedValue'
import { LookupDerivedValue } from '@models/DerivedValue/LookupDerivedValue'
import { Displayable } from '@models/Displayable'
import { MathOperations as MO } from '@models/MathOperations'
import { ReferenceableBase } from '@models/reference'
import { SelectableTrait, SimpleTrait } from '@models/Traits'
import { jsonArrayMember, jsonMember, jsonObject } from 'typedjson'
import { storeInstance } from '../store/data-store'

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

  @jsonArrayMember(BinaryMathExpression)
  private binaryMathExpressions: BinaryMathExpression[] = []

  @jsonArrayMember(SimpleTrait)
  public traits: SimpleTrait[] = []

  @jsonArrayMember(SelectableTrait)
  public selectableTraits: SelectableTrait[] = []

  @jsonArrayMember(Attribute)
  public readonly attributes: Attribute[] = []

  @jsonArrayMember(Ability)
  public readonly abilities: Ability[] = []

  @jsonArrayMember(CalculatedDerivedValue)
  private readonly calculatedDerivedValues: CalculatedDerivedValue[] = []

  @jsonArrayMember(StaticCompositionSource)
  private readonly staticCompositionSources: StaticCompositionSource[] = []

  @jsonArrayMember(LookupDerivedValue)
  private readonly lookupDerivedValues: LookupDerivedValue[] = []

  public get derivedValues(): DerivedValue[] {
    return [...this.calculatedDerivedValues, ...this.lookupDerivedValues]
  }

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
  public removeAbility(ability: Ability): boolean {
    const index = this.abilities.findIndex((x) => x.id === ability.id)

    if (index === -1) {
      return false
    }

    this.abilities.splice(index, 1)
    storeInstance.removeReference(ability)
    return true
  }

  public addCalculatedDerivedValue(derivedValue: CalculatedDerivedValue): void {
    this.calculatedDerivedValues.push(derivedValue)
    storeInstance.addReference(derivedValue)
  }
  public removeCalculatedDerivedValue(
    derivedValue: CalculatedDerivedValue
  ): boolean {
    const index = this.calculatedDerivedValues.findIndex(
      (x) => x.id === derivedValue.id
    )

    if (index === -1) {
      return false
    }

    this.calculatedDerivedValues.splice(index, 1)
    storeInstance.removeReference(derivedValue)
    return true
  }

  public addStaticCompositionSource(
    staticCompositionSource: StaticCompositionSource
  ): void {
    this.staticCompositionSources.push(staticCompositionSource)
    storeInstance.addReference(staticCompositionSource)
  }
  public removeStaticCompositionSource(
    staticCompositionSource: StaticCompositionSource
  ): boolean {
    const index = this.staticCompositionSources.findIndex(
      (x) => x.id === staticCompositionSource.id
    )

    if (index === -1) {
      return false
    }

    this.staticCompositionSources.splice(index, 1)
    storeInstance.removeReference(staticCompositionSource)
    return true
  }

  public addBinaryMathExpression(
    binaryMathExpression: BinaryMathExpression
  ): void {
    this.binaryMathExpressions.push(binaryMathExpression)
    storeInstance.addReference(binaryMathExpression)
  }
  public removeBinaryMathExpression(
    binaryMathExpression: BinaryMathExpression
  ): boolean {
    const index = this.binaryMathExpressions.findIndex(
      (x) => x.id === binaryMathExpression.id
    )

    if (index === -1) {
      return false
    }

    this.binaryMathExpressions.splice(index, 1)
    storeInstance.removeReference(binaryMathExpression)
    return true
  }

  public addLookupDerivedValue(lookupDerivedValue: LookupDerivedValue): void {
    this.lookupDerivedValues.push(lookupDerivedValue)
    storeInstance.addReference(lookupDerivedValue)
  }
  public removeLookupDerivedValue(
    lookupDerivedValue: LookupDerivedValue
  ): boolean {
    const index = this.lookupDerivedValues.findIndex(
      (x) => x.id === lookupDerivedValue.id
    )

    if (index === -1) {
      return false
    }

    this.lookupDerivedValues.splice(index, 1)
    storeInstance.removeReference(lookupDerivedValue)
    return true
  }

  public addSelectableTrait(selectableTrait: SelectableTrait): void {
    this.selectableTraits.push(selectableTrait)
    storeInstance.addReference(selectableTrait)
  }
  public removeSelectableTrait(selectableTrait: SelectableTrait): boolean {
    const index = this.selectableTraits.findIndex(
      (x) => x.id === selectableTrait.id
    )

    if (index === -1) {
      return false
    }

    this.selectableTraits.splice(index, 1)
    storeInstance.removeReference(selectableTrait)
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
    this.addSelectableTrait(race)

    const attributeMap = new Map<string, Attribute>()

    const chrisma = new Attribute('Ausstrahlung')
    attributeMap.set(chrisma.label, chrisma)
    this.addAttribute(chrisma)

    const agility = new Attribute('Beweglichkeit')
    attributeMap.set(agility.label, agility)
    this.addAttribute(agility)

    const intuition = new Attribute('Intuition')
    attributeMap.set(intuition.label, intuition)
    this.addAttribute(intuition)

    const constitution = new Attribute('Konstitution')
    attributeMap.set(constitution.label, constitution)
    this.addAttribute(constitution)

    const mystic = new Attribute('Mystik')
    attributeMap.set(mystic.label, mystic)
    this.addAttribute(mystic)

    const strength = new Attribute('Stärke')
    attributeMap.set(strength.label, strength)
    this.addAttribute(strength)

    const intellect = new Attribute('Verstand')
    attributeMap.set(intellect.label, intellect)
    this.addAttribute(intellect)

    const willpower = new Attribute('Willenskraft')
    attributeMap.set(willpower.label, willpower)
    this.addAttribute(willpower)

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
      ['Handwerk', 'Konstitution', 'Verstand'],
      ['Heilkunde', 'Intuition', 'Verstand'],
      ['Heimlichkeit', 'Beweglichkeit', 'Intuition'],
      ['Jagdkunst', 'Konstitution', 'Verstand'],
      ['Länderkunde', 'Intuition', 'Verstand'],
      ['Naturkunde', 'Intuition', 'Verstand'],
      ['Redegewandheit', 'Ausstrahlung', 'Willenskraft'],
      ['Schlösser und Fallen', 'Beweglichkeit', 'Intuition'],
      ['Schwimmen', 'Konstitution', 'Stärke'],
      ['Seefahrt', 'Beweglichkeit', 'Konstitution'],
      ['Straßenkunde', 'Ausstrahlung', 'Intuition'],
      ['Tierführung', 'Beweglichkeit', 'Ausstrahlung'],
      ['Überleben', 'Intuition', 'Konstitution'],
      ['Wahrnehmung', 'Intuition', 'Willenskraft'],
      ['Zähigkeit', 'Konstitution', 'Willenskraft'],
    ]

    abilities.forEach(([abilityName, attributeName1, attributeName2]) => {
      const ability = new Ability(abilityName)

      ability.addCompositionSource(attributeMap.get(attributeName1))
      ability.addCompositionSource(attributeMap.get(attributeName2))

      this.addAbility(ability)
    })

    const staticIniSource = new StaticCompositionSource(10)
    this.addStaticCompositionSource(staticIniSource)
    const initiative = new CalculatedDerivedValue(
      'Initiative',
      staticIniSource,
      intuition,
      MO.minus
    )
    this.addCalculatedDerivedValue(initiative)

    const staticFocusMulitplier = new StaticCompositionSource(2)
    this.addStaticCompositionSource(staticFocusMulitplier)

    const focusMWExpression = new BinaryMathExpression(
      mystic,
      willpower,
      MO.plus
    )
    this.addBinaryMathExpression(focusMWExpression)

    const focus = new CalculatedDerivedValue(
      'Focus',
      staticFocusMulitplier,
      focusMWExpression,
      MO.multiply
    )
    this.addCalculatedDerivedValue(focus)

    const sizeClass = new LookupDerivedValue(
      'Größenklasse',
      race,
      new Map<string, number>([
        ['Alb', 5],
        ['Gnom', 3],
        ['Mensch', 5],
        ['Varg', 6],
        ['Zwerg', 4],
      ])
    )
    this.addLookupDerivedValue(sizeClass)

    const speed = new CalculatedDerivedValue(
      'Geschwindigkeit',
      sizeClass,
      agility,
      MO.plus
    )
    this.addCalculatedDerivedValue(speed)

    const consitution = attributeMap.get('Konstitution')
    if (consitution == null) {
      throw new Error('Konstitution attribute missing')
    }

    const hitpoints = new CalculatedDerivedValue(
      'Lebenspunkte',
      sizeClass,
      consitution,
      MO.plus
    )
    this.addCalculatedDerivedValue(hitpoints)

    const defenseStatic = new StaticCompositionSource(12)
    this.addStaticCompositionSource(defenseStatic)

    const defenseAttributeExp = new BinaryMathExpression(
      strength,
      agility,
      MO.plus
    )
    this.addBinaryMathExpression(defenseAttributeExp)

    const defense = new CalculatedDerivedValue(
      'Verteidigung',
      defenseStatic,
      defenseAttributeExp,
      MO.plus
    )

    this.addCalculatedDerivedValue(defense)

    const mentalResistanceStatic = new StaticCompositionSource(12)
    this.addStaticCompositionSource(mentalResistanceStatic)

    const mentalResistanceAttributeExp = new BinaryMathExpression(
      willpower,
      intellect,
      MO.plus
    )
    this.addBinaryMathExpression(mentalResistanceAttributeExp)

    const mentalResistance = new CalculatedDerivedValue(
      'Geistiger Wiederstand',
      mentalResistanceStatic,
      mentalResistanceAttributeExp,
      MO.plus
    )
    this.addCalculatedDerivedValue(mentalResistance)

    const physicalResistanceStatic = new StaticCompositionSource(12)
    this.addStaticCompositionSource(physicalResistanceStatic)

    const physicalResistanceAttributeExp = new BinaryMathExpression(
      willpower,
      constitution,
      MO.plus
    )
    this.addBinaryMathExpression(physicalResistanceAttributeExp)

    const physicalResistance = new CalculatedDerivedValue(
      'Körperlicher Wiederstand',
      physicalResistanceStatic,
      physicalResistanceAttributeExp,
      MO.plus
    )
    this.addCalculatedDerivedValue(physicalResistance)
  }
}
