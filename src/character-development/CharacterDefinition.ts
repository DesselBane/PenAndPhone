import {
  TAttributeState,
  TUnknownAttributeDefinitions,
} from './AttributeDefinition'

export interface ICharacterState<
  TAttributeDefinitions extends TUnknownAttributeDefinitions
> {
  rawAttributes: TAttributeState<TAttributeDefinitions>
  attributes: Readonly<TAttributeState<TAttributeDefinitions>>
}

export interface IAttributeCalculation<
  TAttributeDefinitions extends TUnknownAttributeDefinitions
> {
  attributeId: TAttributeDefinitions[number]['id']
  calculation: (
    currentState: Readonly<ICharacterState<TAttributeDefinitions>>
  ) => number
}

export interface ICharacterEvent<
  TAttributeDefinitions extends TUnknownAttributeDefinitions
> {
  id: string
  resolve: <TPayload extends Readonly<Record<string, any>>>(
    payload: TPayload,
    state: ICharacterState<TAttributeDefinitions>
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

  rawAttributes: TAttributeState<TCharacterDefinition['attributes']>
  attributes: TAttributeState<TCharacterDefinition['attributes']>

  constructor(definition: TCharacterDefinition) {
    this.definition = definition
    const rawAttributes = Object.fromEntries(
      definition.attributes.map((definition) => [
        definition.id,
        definition.type === 'number' ? 0 : '',
      ])
    ) as TAttributeState<TCharacterDefinition['attributes']>
    this.rawAttributes = rawAttributes
    const attributes = Object.defineProperties(
      {},
      Object.fromEntries(
        definition.attributes.map<[string, PropertyDescriptor]>((attribute) => [
          attribute.id,
          {
            get() {
              const calculator = definition.attributeCalculations?.find(
                (calculation) => calculation.attributeId === attribute.id
              )
              if (calculator == null) {
                return rawAttributes[
                  attribute.id as TCharacterDefinition['attributes'][number]['id']
                ]
              }
              return calculator.calculation({ rawAttributes, attributes })
            },
          },
        ])
      )
    ) as TAttributeState<TCharacterDefinition['attributes']>
    this.attributes = attributes
  }

  execute<
    TEvent extends TCharacterDefinition['events'][number],
    TEventId extends TEvent['id']
  >(id: TEventId, payload: Parameters<TEvent['resolve']>[0]) {
    const realEvent = this.definition.events.find((a) => a.id === id)
    if (realEvent == null) {
      return
    }
    realEvent.resolve(payload, {
      rawAttributes: this.rawAttributes,
      attributes: this.attributes,
    })
  }
}
