export class CharacterDefinition<
  TAttributeIds extends ReadonlyArray<string>,
  TResourceIds extends ReadonlyArray<string>
> {
  attributeIds: TAttributeIds
  resourceIds: TResourceIds

  constructor({
    attributeIds,
    resourceIds,
  }: {
    attributeIds: TAttributeIds
    resourceIds: TResourceIds
  }) {
    this.attributeIds = attributeIds
    this.resourceIds = resourceIds
  }
}

export class CharacterRules<
  TCharacterDefinition extends GeneralCharacterDefinition
> {
  characterDefinition: TCharacterDefinition
  attributeCalculations?: ReadonlyArray<
    IAttributeCalculation<TCharacterDefinition>
  >
  events?: ReadonlyArray<ICharacterEvent<TCharacterDefinition>>

  constructor({
    characterDefinition,
    attributeCalculations,
    events,
  }: {
    characterDefinition: TCharacterDefinition
    attributeCalculations?: ReadonlyArray<
      IAttributeCalculation<TCharacterDefinition>
    >
    events?: ReadonlyArray<ICharacterEvent<TCharacterDefinition>>
  }) {
    this.characterDefinition = characterDefinition
    this.attributeCalculations = attributeCalculations
    this.events = events
  }
}

type GeneralCharacterDefinition = CharacterDefinition<
  ReadonlyArray<string>,
  ReadonlyArray<string>
>

export class Attribute<
  TCharacterDefinition extends GeneralCharacterDefinition
> {
  id: TCharacterDefinition['attributeIds'][number]
  value: number = 0

  constructor(id: TCharacterDefinition['attributeIds'][number]) {
    this.id = id
  }
}

export class Resource<TCharacterDefinition extends GeneralCharacterDefinition> {
  id: TCharacterDefinition['resourceIds'][number]
  value: number = 0

  constructor(id: TCharacterDefinition['resourceIds'][number]) {
    this.id = id
  }
}

export interface IAttributeCalculation<
  TCharacterDefinition extends GeneralCharacterDefinition
> {
  attributeId: TCharacterDefinition['attributeIds'][number]
  calculation: (character: Character<TCharacterDefinition>) => number
}

export interface ICharacterEvent<
  TCharacterDefinition extends GeneralCharacterDefinition
> {
  id: string
  resolve: <TPayload extends Record<string, any>>(
    payload: TPayload,
    character: Character<TCharacterDefinition>
  ) => void
}

export class Character<
  TCharacterDefinition extends GeneralCharacterDefinition
> {
  attributes: Map<
    TCharacterDefinition['attributeIds'][number],
    Attribute<TCharacterDefinition>
  >
  resources: Map<
    TCharacterDefinition['resourceIds'][number],
    Resource<TCharacterDefinition>
  >

  constructor(characterDefinition: TCharacterDefinition) {
    this.attributes = new Map(
      characterDefinition.attributeIds.map((id) => [id, new Attribute(id)])
    )
    this.resources = new Map(
      characterDefinition.resourceIds.map((id) => [id, new Resource(id)])
    )
  }
}

const characterDefinition = new CharacterDefinition({
  attributeIds: ['stamina', 'intelligence'],
  resourceIds: ['xp'],
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
  events: [
    {
      id: 'purchaseAttribute',
      resolve(payload, character) {
        const xp = character.resources.get('xp')
      },
    },
  ],
})
