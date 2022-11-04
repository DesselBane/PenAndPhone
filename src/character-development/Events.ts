import { isEqual } from 'lodash-es'
import {
  TUnknownAttributeDefinitions,
  IAttributeGroupDefinitions,
  TFlatAttributeGroupDefinitions,
  TAttributeValue,
} from './AttributeDefinition'
import { ICharacterState } from './CharacterDefinition'

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
    string}`]: TFlatAttributeGroupDefinitions<
    TAttributes,
    TAttributeGroups
  >[Key][number]
} & {
  [Key in keyof TAttributes as `${Key & string}.value`]: TAttributeValue<
    TAttributes[Key]
  >
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
  [Key in keyof TEventDefinitions]: {
    validate?: (
      payload: IResolvedPayload<
        TAttributes,
        TAttributeGroups,
        TEventDefinitions[Key]
      >,
      state: ICharacterState<TAttributes>,
      definition: {
        groups: TAttributeGroups
      }
    ) => string | true
    apply: (
      payload: IResolvedPayload<
        TAttributes,
        TAttributeGroups,
        TEventDefinitions[Key]
      >,
      state: ICharacterState<TAttributes>,
      definition: {
        groups: TAttributeGroups
      }
    ) => void
  }
}

export type UniqueId = string
export type EventId = UniqueId
export type Timestamp = string

export interface EventInstance<
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>,
  TEvents extends IEventDefinitions<TAttributes, TAttributeGroups>,
  TKey extends keyof TEvents & string = keyof TEvents & string
> {
  id: EventId
  type: TKey
  timestamp: Timestamp
  payload: IResolvedPayload<TAttributes, TAttributeGroups, TEvents[TKey]>
}

export class EventHistory<
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>,
  TEvents extends IEventDefinitions<TAttributes, TAttributeGroups>
> {
  events: Map<EventId, EventInstance<TAttributes, TAttributeGroups, TEvents>> =
    new Map()

  constructor(
    events: EventInstance<TAttributes, TAttributeGroups, TEvents>[] = []
  ) {
    this.events = new Map(events.map((event) => [event.id, event]))
  }

  toArray() {
    return [...this.events.values()]
  }

  copy() {
    return new EventHistory(this.toArray())
  }

  add(event: EventInstance<TAttributes, TAttributeGroups, TEvents>) {
    this.events.set(event.id, event)
  }

  remove(id: EventId) {
    this.events.delete(id)
  }

  get(id: EventId) {
    return this.events.get(id)
  }

  has(id: EventId) {
    return this.events.has(id)
  }

  // TODO: Refactor to `.at` when vitest assertions guard against undefined
  at(index: number) {
    return this.toArray()[index]
  }

  findLast<TEventType extends keyof TEvents & string>(
    type: TEventType,
    payload: IResolvedPayload<
      TAttributes,
      TAttributeGroups,
      TEvents[TEventType]
    >
  ) {
    const event = this.toArray()
      .reverse()
      .find((entry) => {
        return type === entry.type && isEqual(payload, entry.payload)
      })
    return event
  }

  forEach(
    callback: (
      event: EventInstance<TAttributes, TAttributeGroups, TEvents>
    ) => void
  ) {
    this.events.forEach((event) => callback(event))
  }
}
