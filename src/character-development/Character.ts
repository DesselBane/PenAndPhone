import { nanoid } from 'nanoid'
import { DeepReadonly } from '../util/UtilityTypes'
import {
  AttributeGroupDefinitions,
  AttributeState,
  UnknownAttributeDefinitions,
  AttributeValue,
} from './AttributeDefinition'
import { NotFoundError, RevertError, ValidationError } from './Errors'
import {
  EventDefinitions,
  EventImpls,
  EventHistory,
  ResolvedPayload,
  EventInstance,
  EventId,
} from './Events'

export interface CharacterState<
  TAttributeDefinitions extends UnknownAttributeDefinitions
> {
  rawAttributes: AttributeState<TAttributeDefinitions>
  attributes: DeepReadonly<AttributeState<TAttributeDefinitions>>
}

export type AttributeCalculations<
  TAttributeDefinitions extends UnknownAttributeDefinitions
> = {
  [Key in keyof TAttributeDefinitions]?: (
    currentState: Readonly<CharacterState<TAttributeDefinitions>>
  ) => AttributeValue<TAttributeDefinitions[Key]>
}

export type CharacterDefinition<
  TAttributes extends UnknownAttributeDefinitions,
  TAttributeGroups extends AttributeGroupDefinitions<TAttributes>,
  TAttributeCalculations extends AttributeCalculations<TAttributes>,
  TEvents extends EventDefinitions<TAttributes, TAttributeGroups>,
  TEventImpls extends EventImpls<TAttributes, TAttributeGroups, TEvents>
> = {
  attributes: TAttributes
  groups: TAttributeGroups
  calculations: TAttributeCalculations
  events: TEvents
  eventImplementations: TEventImpls
}

export const defineCharacter = <
  TAttributes extends UnknownAttributeDefinitions,
  TAttributeGroups extends AttributeGroupDefinitions<TAttributes>,
  TAttributeCalculations extends AttributeCalculations<TAttributes>,
  TEvents extends EventDefinitions<TAttributes, TAttributeGroups>,
  TEventImpls extends EventImpls<TAttributes, TAttributeGroups, TEvents>
>(
  attributes: TAttributes,
  groups: TAttributeGroups,
  calculations: TAttributeCalculations,
  events: TEvents,
  eventImplementations: TEventImpls
) => ({
  attributes,
  groups,
  calculations,
  events,
  eventImplementations,
  addEvents: <
    TNewEvents extends EventDefinitions<TAttributes, TAttributeGroups>,
    TNewEventImpls extends EventImpls<TAttributes, TAttributeGroups, TNewEvents>
  >(
    newEvents: TNewEvents,
    newEventImplementations: TNewEventImpls
  ) =>
    defineCharacter(
      attributes,
      groups,
      calculations,
      { ...events, ...newEvents },
      { ...eventImplementations, ...newEventImplementations } as EventImpls<
        TAttributes,
        TAttributeGroups,
        TEvents & TNewEvents
      >
    ),
  enhance: <
    TNewAttributes extends UnknownAttributeDefinitions,
    TNewAttributeGroups extends AttributeGroupDefinitions<
      TAttributes & TNewAttributes
    >,
    TNewAttributeCalculations extends AttributeCalculations<
      TAttributes & TNewAttributes
    >,
    TNewEvents extends EventDefinitions<
      TAttributes & TNewAttributes,
      TAttributeGroups & TNewAttributeGroups
    >,
    TNewEventImpls extends EventImpls<
      TAttributes & TNewAttributes,
      TAttributeGroups & TNewAttributeGroups,
      TNewEvents
    >
  >(
    newAttributes: TNewAttributes,
    newGroups: TNewAttributeGroups,
    newCalculations: TNewAttributeCalculations,
    newEvents: TNewEvents,
    newEventImplementations: TNewEventImpls
  ) =>
    defineCharacter(
      {
        ...attributes,
        ...newAttributes,
      },
      {
        ...groups,
        ...newGroups,
      },
      {
        ...calculations,
        ...newCalculations,
      },
      {
        ...events,
        ...newEvents,
      },
      { ...eventImplementations, ...newEventImplementations } as EventImpls<
        TAttributes & TNewAttributes,
        TAttributeGroups & TNewAttributeGroups,
        TEvents & TNewEvents
      >
    ),
})

export class Character<
  TAttributes extends UnknownAttributeDefinitions,
  TAttributeGroups extends AttributeGroupDefinitions<TAttributes>,
  TAttributeCalculations extends AttributeCalculations<TAttributes>,
  TEvents extends EventDefinitions<TAttributes, TAttributeGroups>,
  TEventImpls extends EventImpls<TAttributes, TAttributeGroups, TEvents>
> {
  definition: CharacterDefinition<
    TAttributes,
    TAttributeGroups,
    TAttributeCalculations,
    TEvents,
    TEventImpls
  >

  history = new EventHistory<TAttributes, TAttributeGroups, TEvents>()
  rawAttributes!: AttributeState<TAttributes>
  attributes!: DeepReadonly<AttributeState<TAttributes>>

  constructor(
    definition: CharacterDefinition<
      TAttributes,
      TAttributeGroups,
      TAttributeCalculations,
      TEvents,
      TEventImpls
    >
  ) {
    this.definition = definition
    this.resetState()
  }

  get state() {
    return {
      rawAttributes: this.rawAttributes,
      attributes: this.attributes,
    }
  }

  // TODO: make private (check SplittermondView.vue and useEventButton for Error)
  resetState() {
    const definition = this.definition
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
            break
          case 'multi-select':
            previousValue[key] = []
        }

        return previousValue
      },
      {} as Record<string, unknown>
    ) as AttributeState<TAttributes>
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
    ) as DeepReadonly<AttributeState<TAttributes>>
    this.attributes = attributes
  }

  validate<TEventType extends keyof TEvents & string>(
    type: TEventType,
    payload: ResolvedPayload<TAttributes, TAttributeGroups, TEvents[TEventType]>
  ) {
    const { validate } = this.definition.eventImplementations[type]
    if (!validate) {
      return true
    }
    return validate(payload, this.state, this.definition)
  }

  execute<TEventType extends keyof TEvents & string>(
    type: TEventType,
    payload: ResolvedPayload<TAttributes, TAttributeGroups, TEvents[TEventType]>
  ) {
    const event: EventInstance<TAttributes, TAttributeGroups, TEvents> = {
      id: nanoid(),
      type,
      timestamp: '',
      payload,
    }

    const applyResult = this.apply(event)

    if (applyResult instanceof ValidationError) {
      return applyResult
    }

    this.history.add(event)
  }

  apply(event: EventInstance<TAttributes, TAttributeGroups, TEvents>) {
    const eventImpl = this.definition.eventImplementations[event.type]

    if (eventImpl.validate) {
      const validationResult = eventImpl.validate(
        event.payload,
        this.state,
        this.definition
      )
      if (validationResult !== true) {
        return new ValidationError(validationResult)
      }
    }

    eventImpl.apply(event.payload, this.state, this.definition)
  }

  validateRevert<TEventType extends keyof TEvents & string>(
    type: TEventType,
    payload: ResolvedPayload<TAttributes, TAttributeGroups, TEvents[TEventType]>
  ) {
    const event = this.history.findLast(type, payload)

    if (!event) {
      return new NotFoundError(`Event with type '${type}' not found.`)
    }

    return this.validateRevertById(event.id)
  }

  revert<TEventType extends keyof TEvents & string>(
    type: TEventType,
    payload: ResolvedPayload<TAttributes, TAttributeGroups, TEvents[TEventType]>
  ) {
    const event = this.history.findLast(type, payload)

    if (!event) {
      return new NotFoundError(`Event with type '${type}' not found.`)
    }

    return this.revertById(event.id)
  }

  validateRevertById(id: EventId) {
    if (!this.history.has(id)) {
      return new NotFoundError(`Event with id '${id}' not found.`)
    }

    const revertError = new RevertError<
      TAttributes,
      TAttributeGroups,
      TEvents
    >()

    const testChar = new Character(this.definition)
    const history = this.history.copy()
    history.remove(id)
    history.forEach((event) => {
      const applyResult = testChar.apply(event)
      if (applyResult instanceof ValidationError) {
        revertError.add(event, applyResult)
      }
    })

    if (revertError.errors.length > 0) {
      return revertError
    }

    return true
  }

  revertById(id: EventId) {
    if (!this.history.has(id)) {
      return new NotFoundError(`Event with id '${id}' not found.`)
    }

    const oldHistory = this.history.copy()

    this.resetState()
    this.history.remove(id)

    const revertError = new RevertError<
      TAttributes,
      TAttributeGroups,
      TEvents
    >()

    this.history.forEach((event) => {
      const applyResult = this.apply(event)
      if (applyResult instanceof ValidationError) {
        revertError.add(event, applyResult)
      }
    })

    if (revertError.errors.length > 0) {
      this.resetState()
      this.history = oldHistory
      this.history.forEach((event) => this.apply(event))
      return revertError
    }
  }

  getAttribute(key: keyof TAttributes) {
    return {
      value: this.attributes[key],
      rawValue: this.rawAttributes[key],
    }
  }
}
