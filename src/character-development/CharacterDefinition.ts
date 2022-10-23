import { DeepReadonly } from '../util/UtilityTypes'
import {
  IAttributeGroupDefinitions,
  TAttributeState,
  TUnknownAttributeDefinitions,
  TAttributeValue,
} from './AttributeDefinition'

export interface ICharacterState<
  TAttributeDefinitions extends TUnknownAttributeDefinitions
> {
  rawAttributes: TAttributeState<TAttributeDefinitions>
  attributes: DeepReadonly<TAttributeState<TAttributeDefinitions>>
}

export type IAttributeCalculation<
  TAttributeDefinitions extends TUnknownAttributeDefinitions,
  TAttribute extends TAttributeDefinitions[number],
  TAttributeId extends TAttribute['id']
> = DeepReadonly<{
  attributeId: TAttributeId
  calculation: (
    currentState: Readonly<ICharacterState<TAttributeDefinitions>>
  ) => TAttributeValue<TAttribute>
}>

type IAttributeCalculations<
  TAttributeDefinitions extends TUnknownAttributeDefinitions
> = DeepReadonly<
  IAttributeCalculation<
    TAttributeDefinitions,
    TAttributeDefinitions[number],
    TAttributeDefinitions[number]['id']
  >[]
>

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

export type ICharacterDefinitionBase<
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>
> = {
  attributes: TAttributes
  groups: TAttributeGroups
}

export type ICharacterDefinition<
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>,
  TAttributeCalculations extends IAttributeCalculations<TAttributes>,
  TEvents extends DeepReadonly<ICharacterEvent<TAttributes, TAttributeGroups>[]>
> = {
  attributes: TAttributes
  groups: TAttributeGroups
  calculations: TAttributeCalculations
  events: TEvents
}

export const createCharacterDefinitionBase = <
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>
>(
  attributes: TAttributes,
  groups: TAttributeGroups
): ICharacterDefinitionBase<TAttributes, TAttributeGroups> => ({
  attributes,
  groups,
})

export const createCharacterDefinition = <
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>,
  TAttributeCalculations extends IAttributeCalculations<TAttributes>,
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
  TCharacterDefinition extends ReturnType<typeof createCharacterDefinition>,
  TAttributes extends TCharacterDefinition['attributes'],
  TEvents extends TCharacterDefinition['events']
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
                return rawAttributes[attribute.id as TAttributes[number]['id']]
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
