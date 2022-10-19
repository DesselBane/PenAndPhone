import {
  TAttributeState,
  TUnknownAttributeDefinition,
} from './AttributeDefinition'

type TUnknownAttributeDefinitions = ReadonlyArray<TUnknownAttributeDefinition>

export interface IAttributeCalculation<
  TAttributeDefinitions extends TUnknownAttributeDefinitions
> {
  attributeId: TAttributeDefinitions[number]['id']
  calculation: (currentState: TAttributeState<TAttributeDefinitions>) => number
}

export interface ICharacterEvent<
  TPayload extends Record<string, any>,
  TAttributeDefinitions extends TUnknownAttributeDefinitions
> {
  id: string
  resolve: (
    payload: TPayload,
    state: TAttributeState<TAttributeDefinitions>
  ) => void
}

export const createCharacterDefinition = <
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeCalculations extends ReadonlyArray<
    IAttributeCalculation<TAttributes>
  >,
  TEvents extends ReadonlyArray<
    ICharacterEvent<Record<string, any>, TAttributes>
  >
>(definition: {
  attributes: TAttributes
  attributeCalculations: TAttributeCalculations
  events: TEvents
}) => definition

export class Character<
  TCharacterDefinition extends ReturnType<typeof createCharacterDefinition>
> {
  definition: TCharacterDefinition

  private currentState: TAttributeState<TCharacterDefinition['attributes']>
  state: TAttributeState<TCharacterDefinition['attributes']>

  constructor(definition: TCharacterDefinition) {
    this.definition = definition
    this.currentState = Object.fromEntries(
      definition.attributes.map((definition) => [
        definition.id,
        definition.type === 'number' ? 0 : '',
      ])
    ) as TAttributeState<TCharacterDefinition['attributes']>
    this.state = new Proxy(this.currentState, {
      get(state, attributeId, receiver) {
        const calculation = definition.attributeCalculations?.find(
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

  execute(
    id: TCharacterDefinition['events'][number]['id'],
    payload: Record<string, any>
  ) {
    const realEvent = this.definition.events.find((a) => a.id === id)
    if (realEvent == null) {
      return
    }
    realEvent.resolve(payload, this.state)
  }
}
