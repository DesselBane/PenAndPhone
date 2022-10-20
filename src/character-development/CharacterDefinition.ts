import {
  TAttributeState,
  TUnknownAttributeDefinitions,
} from './AttributeDefinition'

export interface IAttributeCalculation<
  TAttributeDefinitions extends TUnknownAttributeDefinitions
> {
  attributeId: TAttributeDefinitions[number]['id']
  calculation: (currentState: TAttributeState<TAttributeDefinitions>) => number
}

export interface ICharacterEvent<
  TAttributeDefinitions extends TUnknownAttributeDefinitions
> {
  id: string
  resolve: <TPayload extends Readonly<Record<string, any>>>(
    payload: TPayload,
    state: TAttributeState<TAttributeDefinitions>
  ) => void
}

export const createCharacterDefinition =
  <TAttributes extends TUnknownAttributeDefinitions>(staticDefinition: {
    attributes: TAttributes
  }) =>
  <
    TAttributeCalculations extends ReadonlyArray<
      IAttributeCalculation<TAttributes>
    >,
    TEvents extends ReadonlyArray<ICharacterEvent<TAttributes>>
  >(definition: {
    attributeCalculations: TAttributeCalculations
    events: TEvents
  }) => ({
    ...staticDefinition,
    ...definition,
  })

export class Character<
  TCharacterDefinition extends ReturnType<
    ReturnType<typeof createCharacterDefinition>
  >
> {
  definition: TCharacterDefinition

  private _state: TAttributeState<TCharacterDefinition['attributes']>
  state: TAttributeState<TCharacterDefinition['attributes']>

  constructor(definition: TCharacterDefinition) {
    this.definition = definition
    this._state = Object.fromEntries(
      definition.attributes.map((definition) => [
        definition.id,
        definition.type === 'number' ? 0 : '',
      ])
    ) as TAttributeState<TCharacterDefinition['attributes']>
    this.state = new Proxy(this._state, {
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

  execute<
    TEvent extends TCharacterDefinition['events'][number],
    TEventId extends TEvent['id']
  >(id: TEventId, payload: Parameters<TEvent['resolve']>[0]) {
    const realEvent = this.definition.events.find((a) => a.id === id)
    if (realEvent == null) {
      return
    }
    realEvent.resolve(payload, this.state)
  }
}
