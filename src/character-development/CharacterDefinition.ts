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
  TCharacterDefinition extends TUnknownCharacterDefinition,
  TCharacterRules extends CharacterRules<TCharacterDefinition>
> {
  private currentState: TAttributeState<
    TCharacterDefinition['attributeDefinitions']
  >
  state: TAttributeState<TCharacterDefinition['attributeDefinitions']>

  constructor(definition: TCharacterDefinition, rules: TCharacterRules) {
    this.currentState = Object.fromEntries(
      definition.attributeDefinitions.map((definition) => [
        definition.id,
        definition.type === 'number' ? 0 : '',
      ])
    ) as TAttributeState<TCharacterDefinition['attributeDefinitions']>
    this.state = new Proxy(this.currentState, {
      get(state, attributeId, receiver) {
        const calculation = rules.attributeCalculations?.find(
          (calculation) => calculation.attributeId === attributeId
        )
        const currentValue = Reflect.get(state, attributeId, receiver)
        if (calculation == null) {
          return currentValue
        }
        return calculation.calculation(state)
      },
    })
  }
}

export interface IAttributeCalculation<
  TCharacterDefinition extends TUnknownCharacterDefinition
> {
  attributeId: TCharacterDefinition['attributeDefinitions'][number]['id']
  calculation: (
    currentState: Character<
      TCharacterDefinition,
      CharacterRules<TCharacterDefinition>
    >['currentState']
  ) => number
}

export interface ICharacterEvent<
  TCharacterDefinition extends TUnknownCharacterDefinition
> {
  id: string
  resolve: <TPayload extends Record<string, any>>(
    payload: TPayload,
    character: Character<
      TCharacterDefinition,
      CharacterRules<TCharacterDefinition>
    >
  ) => void
}
