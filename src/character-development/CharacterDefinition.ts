import { DeepReadonly } from '../util/UtilityTypes'
import {
  IAttributeGroupDefinitions,
  TAttributeState,
  TUnknownAttributeDefinitions,
} from './AttributeDefinition'

export interface ICharacterState<
  TAttributeDefinitions extends TUnknownAttributeDefinitions
> {
  rawAttributes: TAttributeState<TAttributeDefinitions>
  attributes: DeepReadonly<TAttributeState<TAttributeDefinitions>>
}

export type IAttributeCalculation<
  TAttributeDefinitions extends TUnknownAttributeDefinitions
> = DeepReadonly<{
  attributeId: TAttributeDefinitions[number]['id']
  calculation: (
    currentState: Readonly<ICharacterState<TAttributeDefinitions>>
  ) => number
}>

export type ICharacterEvent<
  TAttributeDefinitions extends TUnknownAttributeDefinitions,
  TAttributeGroupDefinitions extends IAttributeGroupDefinitions<TAttributeDefinitions>
> = DeepReadonly<{
  id: string
  resolve: <TPayload extends Readonly<Record<string, any>>>(
    payload: TPayload,
    state: ICharacterState<TAttributeDefinitions>,
    attributeDefinitions: TAttributeDefinitions,
    attributeGroupDefinitions: TAttributeGroupDefinitions
  ) => void
}>

export type ICharacterDefinition<
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>,
  TAttributeCalculations extends DeepReadonly<
    IAttributeCalculation<TAttributes>[]
  >,
  TEvents extends DeepReadonly<ICharacterEvent<TAttributes, TAttributeGroups>[]>
> = {
  attributes: TAttributes
  groups: TAttributeGroups
  calculations: TAttributeCalculations
  events: TEvents
}

export const createCharacterDefinition = <
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>,
  TAttributeCalculations extends DeepReadonly<
    IAttributeCalculation<TAttributes>[]
  >,
  TEvents extends DeepReadonly<ICharacterEvent<TAttributes, TAttributeGroups>[]>
>(
  attributes: TAttributes,
  groups: TAttributeGroups,
  calculations: TAttributeCalculations,
  events: TEvents
): ICharacterDefinition<
  TAttributes,
  TAttributeGroups,
  TAttributeCalculations,
  TEvents
> => ({
  attributes,
  groups,
  calculations,
  events,
})

export class Character<
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>,
  TAttributeCalculations extends DeepReadonly<
    IAttributeCalculation<TAttributes>[]
  >,
  TEvents extends DeepReadonly<
    ICharacterEvent<TAttributes, TAttributeGroups>[]
  >,
  TCharacterDefinition extends ICharacterDefinition<
    TAttributes,
    TAttributeGroups,
    TAttributeCalculations,
    TEvents
  >
> {
  definition: TCharacterDefinition

  rawAttributes: TAttributeState<TAttributes>
  attributes: DeepReadonly<TAttributeState<TAttributes>>

  constructor(definition: TCharacterDefinition) {
    this.definition = definition
    const rawAttributes = Object.fromEntries(
      definition.attributes.map((definition) => [
        definition.id,
        definition.type === 'number' ? 0 : '',
      ])
    ) as TAttributeState<TAttributes>
    this.rawAttributes = rawAttributes
    const attributes = Object.defineProperties(
      {},
      Object.fromEntries(
        definition.attributes.map<[string, PropertyDescriptor]>((attribute) => [
          attribute.id,
          {
            get() {
              const calculator = definition.calculations?.find(
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
    ) as DeepReadonly<TAttributeState<TAttributes>>
    this.attributes = attributes
  }

  execute<TEvent extends TEvents[number], TEventId extends TEvent['id']>(
    id: TEventId,
    payload: Parameters<TEvent['resolve']>[0]
  ) {
    const realEvent = this.definition.events.find((a) => a.id === id)
    if (realEvent == null) {
      return
    }
    realEvent.resolve(
      payload,
      {
        rawAttributes: this.rawAttributes,
        attributes: this.attributes,
      },
      this.definition.attributes,
      this.definition.groups
    )
  }
}
