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

export type IAllowedPayloadTypeMap<
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>
> = {
  number: number
  string: string
  boolean: boolean
  attributeId: keyof TAttributes
} & {
  [Key in keyof TAttributeGroups as `group.${Key &
    string}`]: TAttributeGroups[Key][number]
}

export type IResolvedPayload<
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>,
  TPayloadDefinition extends Record<
    string,
    keyof IAllowedPayloadTypeMap<TAttributes, TAttributeGroups>
  >
> = {
  [Key in keyof TPayloadDefinition]: IAllowedPayloadTypeMap<
    TAttributes,
    TAttributeGroups
  >[TPayloadDefinition[Key]]
}

export type IEventDefinitions<
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>
> = Record<
  string,
  Record<string, keyof IAllowedPayloadTypeMap<TAttributes, TAttributeGroups>>
>

export type IEventImpls<
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>,
  TEventDefinitions extends IEventDefinitions<TAttributes, TAttributeGroups>
> = {
  [Key in keyof TEventDefinitions]: (
    payload: IResolvedPayload<
      TAttributes,
      TAttributeGroups,
      TEventDefinitions[Key]
    >,
    state: ICharacterState<TAttributes>
  ) => void
}

export type ICharacterDefinition<
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>,
  TAttributeCalculations extends IAttributeCalculations<TAttributes>,
  TEvents extends IEventDefinitions<TAttributes, TAttributeGroups>,
  TEventImpls extends IEventImpls<TAttributes, TAttributeGroups, TEvents>
> = {
  attributes: TAttributes
  groups: TAttributeGroups
  calculations: TAttributeCalculations
  events: TEvents
  eventImplementations: TEventImpls
}

export const defineCharacter = <
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>,
  TAttributeCalculations extends IAttributeCalculations<TAttributes>,
  TEvents extends IEventDefinitions<TAttributes, TAttributeGroups>,
  TEventImpls extends IEventImpls<TAttributes, TAttributeGroups, TEvents>
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
  TEvents extends IEventDefinitions<TAttributes, TAttributeGroups>,
  TEventImpls extends IEventImpls<TAttributes, TAttributeGroups, TEvents>
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
    payload: IResolvedPayload<TAttributes, TAttributeGroups, TEvents[TEventId]>
  ) {
    const realEvent = this.definition.eventImplementations[id]

    realEvent(payload, {
      rawAttributes: this.rawAttributes,
      attributes: this.attributes,
    })
  }
}
