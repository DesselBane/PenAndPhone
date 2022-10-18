import {
  TAttributeState,
  TUnknownAttributeDefinition,
} from './AttributeDefinition'

export interface ICharacterDefinition<
  TAttributeDefinitions extends ReadonlyArray<TUnknownAttributeDefinition>
> {
  attributeDefinitions: TAttributeDefinitions
}

export const createCharacterDefinition = <
  TCharacterDefinition extends ICharacterDefinition<
    ReadonlyArray<TUnknownAttributeDefinition>
  >
>(
  definition: TCharacterDefinition
): TCharacterDefinition => definition

export interface ICharacterRules<
  TCharacterDefinition extends TUnknownCharacterDefinition
> {
  attributeCalculations?: ReadonlyArray<
    IAttributeCalculation<TCharacterDefinition>
  >
  events: ReadonlyArray<
    ICharacterEvent<Record<string, any>, TCharacterDefinition>
  >
}

export const createCharacterRules =
  <TCharacterDefinition extends TUnknownCharacterDefinition>() =>
  <TCharacterRules extends ICharacterRules<TCharacterDefinition>>(
    rules: TCharacterRules
  ) =>
    rules

type TUnknownCharacterDefinition = ICharacterDefinition<
  ReadonlyArray<TUnknownAttributeDefinition>
>

export class Character<
  TCharacterDefinition extends TUnknownCharacterDefinition,
  TCharacterRules extends ICharacterRules<TCharacterDefinition>
> {
  private currentState: TAttributeState<
    TCharacterDefinition['attributeDefinitions']
  >
  state: TAttributeState<TCharacterDefinition['attributeDefinitions']>
  rules: TCharacterRules

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
    this.rules = rules
  }

  execute(
    id: TCharacterRules['events'][number]['id'],
    payload: Record<string, any>
  ) {
    const realEvent = this.rules.events.find((a) => a.id === id)
    if (realEvent == null) {
      return
    }
    realEvent.resolve(payload, this.state)
  }
}

export interface IAttributeCalculation<
  TCharacterDefinition extends TUnknownCharacterDefinition
> {
  attributeId: TCharacterDefinition['attributeDefinitions'][number]['id']
  calculation: (
    currentState: Character<
      TCharacterDefinition,
      ICharacterRules<TCharacterDefinition>
    >['currentState']
  ) => number
}

export interface ICharacterEvent<
  TPayload extends Record<string, any>,
  TCharacterDefinition extends TUnknownCharacterDefinition
> {
  id: string
  resolve: (
    payload: TPayload,
    state: Character<
      TCharacterDefinition,
      ICharacterRules<TCharacterDefinition>
    >['currentState']
  ) => void
}
