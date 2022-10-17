import { TUnknownAttributeDefinition } from './AttributeDefinition'

export class CharacterDefinition<
  TAttributeDefinitions extends ReadonlyArray<TUnknownAttributeDefinition>
> {
  attributeDefinitions: TAttributeDefinitions

  constructor({
    attributeDefinitions,
  }: {
    attributeDefinitions: TAttributeDefinitions
  }) {
    this.attributeDefinitions = attributeDefinitions
  }
}

export class CharacterRules<
  TCharacterDefinition extends TUnknownCharacterDefinition
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

type TUnknownCharacterDefinition = CharacterDefinition<
  ReadonlyArray<TUnknownAttributeDefinition>
>

type TAttributeState<
  TAttributeDefinitions extends ReadonlyArray<TUnknownAttributeDefinition>
> = {
  [Definition in TAttributeDefinitions[number] as Definition['id']]: Definition['type'] extends 'number'
    ? number
    : string
}

export class Character<
  TCharacterDefinition extends TUnknownCharacterDefinition
> {
  currentState: TAttributeState<TCharacterDefinition['attributeDefinitions']>

  constructor(characterDefinition: TCharacterDefinition) {
    this.currentState = Object.fromEntries(
      characterDefinition.attributeDefinitions.map((definition) => [
        definition.id,
        definition.type === 'number' ? 0 : '',
      ])
    ) as TAttributeState<TCharacterDefinition['attributeDefinitions']>
  }
}

export interface IAttributeCalculation<
  TCharacterDefinition extends TUnknownCharacterDefinition
> {
  attributeId: TCharacterDefinition['attributeDefinitions'][number]['id']
  calculation: (
    currentState: Character<TCharacterDefinition>['currentState']
  ) => number
}

export interface ICharacterEvent<
  TCharacterDefinition extends TUnknownCharacterDefinition
> {
  id: string
  resolve: <TPayload extends Record<string, any>>(
    payload: TPayload,
    character: Character<TCharacterDefinition>
  ) => void
}

const characterDefinition = new CharacterDefinition({
  attributeDefinitions: [
    { id: 'xp', type: 'number' },
    { id: 'name', type: 'text' },
    { id: 'intelligence', type: 'number' },
    { id: 'stamina', type: 'number' },
    { id: 'climbing', type: 'number' },
    {
      id: 'race',
      type: 'single-select',
      options: [
        { id: 'human', value: 'Human' },
        { id: 'warg', value: 'Warg' },
      ],
    },
  ],
} as const)

const charRules = new CharacterRules({
  characterDefinition,
  attributeCalculations: [
    {
      attributeId: 'climbing',
      calculation(state) {
        return state.intelligence + state.stamina
      },
    },
  ],
  events: [
    {
      id: 'purchaseAttribute',
      resolve(payload, character) {
        const xp = character.currentState.xp
      },
    },
  ],
})
