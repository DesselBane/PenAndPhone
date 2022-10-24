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

export type IAttributeCalculations<
  TAttributeDefinitions extends TUnknownAttributeDefinitions
> = {
  [Key in keyof TAttributeDefinitions]?: (
    currentState: Readonly<ICharacterState<TAttributeDefinitions>>
  ) => TAttributeValue<TAttributeDefinitions[Key]>
}

export type IAllowedPayloadTyp = 'number'

export type IAllowedPayloadTypeMap = {
  number: number
}

export type IResolvedPayload<
  TPayloadDefinition extends Record<string, IAllowedPayloadTyp>
> = {
  [Key in keyof TPayloadDefinition]: IAllowedPayloadTypeMap[TPayloadDefinition[Key]]
}

export type IEventDefinitions = Record<
  string,
  Record<string, IAllowedPayloadTyp>
>

export type IEventImpls<
  TEventDefinitions extends IEventDefinitions,
  TAttributes extends TUnknownAttributeDefinitions
> = {
  [Key in keyof TEventDefinitions]: (
    payload: IResolvedPayload<TEventDefinitions[Key]>,
    state: ICharacterState<TAttributes>
  ) => void
}

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
  TEvents extends IEventDefinitions,
  TEventImpls extends IEventImpls<TEvents, TAttributes>
> = {
  attributes: TAttributes
  groups: TAttributeGroups
  calculations: TAttributeCalculations
  events: TEvents
  eventImplementations: TEventImpls
}

export const defineCharacterAttributes = <
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>
>(
  attributes: TAttributes,
  groups: TAttributeGroups
): ICharacterDefinitionBase<TAttributes, TAttributeGroups> => ({
  attributes,
  groups,
})

export const defineCharacter = <
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>,
  TAttributeCalculations extends IAttributeCalculations<TAttributes>,
  TEvents extends IEventDefinitions,
  TEventImpls extends IEventImpls<TEvents, TAttributes>
>(
  attributes: TAttributes,
  groups: TAttributeGroups,
  calculations: TAttributeCalculations,
  events: TEvents,
  eventImplementations: TEventImpls
): ICharacterDefinition<
  TAttributes,
  TAttributeGroups,
  TAttributeCalculations,
  TEvents,
  TEventImpls
> => ({
  attributes,
  groups,
  calculations,
  events,
  eventImplementations,
})

export class Character<
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>,
  TAttributeCalculations extends IAttributeCalculations<TAttributes>,
  TEvents extends IEventDefinitions,
  TEventImpls extends IEventImpls<TEvents, TAttributes>
> {
  definition: ICharacterDefinition<
    TAttributes,
    TAttributeGroups,
    TAttributeCalculations,
    TEvents,
    TEventImpls
  >

  rawAttributes: TAttributeState<TAttributes>
  attributes: DeepReadonly<TAttributeState<TAttributes>>

  constructor(
    definition: ICharacterDefinition<
      TAttributes,
      TAttributeGroups,
      TAttributeCalculations,
      TEvents,
      TEventImpls
    >
  ) {
    this.definition = definition
    const rawAttributes = Object.entries(definition.attributes).reduce(
      (previousValue, [key, value]) => {
        switch (value.type) {
          case 'number':
            previousValue[key] = 0
            break
          case 'text':
            previousValue[key] = ''
            break
          case 'single-select':
            previousValue[key] = value.options[0]
        }

        return previousValue
      },
      {} as Record<string, unknown>
    ) as TAttributeState<TAttributes>
    this.rawAttributes = rawAttributes

    const attributes = Object.defineProperties(
      {},
      Object.fromEntries(
        Object.keys(definition.attributes).map<[string, PropertyDescriptor]>(
          (id) => [
            id,
            {
              get() {
                const method = definition.calculations[id]

                if (method == null) {
                  return rawAttributes[id]
                }
                return method({ rawAttributes, attributes })
              },
            },
          ]
        )
      )
    ) as DeepReadonly<TAttributeState<TAttributes>>
    this.attributes = attributes
  }

  execute<TEventId extends keyof TEvents & string>(
    id: TEventId,
    payload: IResolvedPayload<TEvents[TEventId]>
  ) {
    const realEvent = this.definition.eventImplementations[id]

    realEvent(payload, {
      rawAttributes: this.rawAttributes,
      attributes: this.attributes,
    })
  }
}
