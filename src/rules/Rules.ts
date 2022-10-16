export class CharacterDefinition<TAttributeIds extends ReadonlyArray<string>> {
  attributeIds: TAttributeIds

  constructor({ attributeIds }: { attributeIds: TAttributeIds }) {
    this.attributeIds = attributeIds
  }
}

export class CharacterRules<
  TCharacterDefinition extends GeneralCharacterDefinition
> {
  characterDefinition: TCharacterDefinition
  attributeCalculations: ReadonlyArray<
    IAttributeCalculation<TCharacterDefinition>
  >

  constructor({
    characterDefinition,
    attributeCalculations,
  }: {
    characterDefinition: TCharacterDefinition
    attributeCalculations: ReadonlyArray<
      IAttributeCalculation<TCharacterDefinition>
    >
  }) {
    this.characterDefinition = characterDefinition
    this.attributeCalculations = attributeCalculations
  }
}

type GeneralCharacterDefinition = CharacterDefinition<ReadonlyArray<string>>

export class Attribute<
  TCharacterDefinition extends GeneralCharacterDefinition
> {
  id: TCharacterDefinition['attributeIds'][number]
  value: number = 0

  constructor(id: TCharacterDefinition['attributeIds'][number]) {
    this.id = id
  }
}

export interface IAttributeCalculation<
  TCharacterDefinition extends GeneralCharacterDefinition
> {
  attributeId: TCharacterDefinition['attributeIds'][number]
  calculation: (character: Character<TCharacterDefinition>) => number
}

export class Character<
  TCharacterDefinition extends GeneralCharacterDefinition
> {
  attributes: Map<
    TCharacterDefinition['attributeIds'][number],
    Attribute<TCharacterDefinition>
  >

  constructor(characterDefinition: TCharacterDefinition) {
    this.attributes = new Map(
      characterDefinition.attributeIds.map((id) => [id, new Attribute(id)])
    )
  }
}

const characterDefinition = new CharacterDefinition({
  attributeIds: ['stamina', 'intelligence'],
} as const)
const charChanges = new CharacterRules({
  characterDefinition,
  attributeCalculations: [
    {
      attributeId: 'stamina',
      calculation(character) {
        return character.attributes.get('intelligence')?.value ?? 0
      },
    },
  ],
})
