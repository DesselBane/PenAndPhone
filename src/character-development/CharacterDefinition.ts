import { nanoid } from 'nanoid'
import { DeepReadonly } from '../util/UtilityTypes'
import {
  IAttributeGroupDefinitions,
  TAttributeState,
  TUnknownAttributeDefinitions,
  TAttributeValue,
} from './AttributeDefinition'
import { NotFoundError, RevertError, ValidationError } from './Errors'
import {
  IEventDefinitions,
  IEventImpls,
  EventHistory,
  IResolvedPayload,
  EventInstance,
  EventId,
} from './Events'

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

  history = new EventHistory<TAttributes, TAttributeGroups, TEvents>()
  rawAttributes!: TAttributeState<TAttributes>
  attributes!: DeepReadonly<TAttributeState<TAttributes>>

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

  validate<TEventType extends keyof TEvents & string>(
    type: TEventType,
    payload: IResolvedPayload<
      TAttributes,
      TAttributeGroups,
      TEvents[TEventType]
    >
  ) {
    const { validate } = this.definition.eventImplementations[type]
    if (!validate) {
      return true
    }
    return validate(payload, this.state, this.definition)
  }

  execute<TEventType extends keyof TEvents & string>(
    type: TEventType,
    payload: IResolvedPayload<
      TAttributes,
      TAttributeGroups,
      TEvents[TEventType]
    >
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
    payload: IResolvedPayload<
      TAttributes,
      TAttributeGroups,
      TEvents[TEventType]
    >
  ) {
    const event = this.history.findLast(type, payload)

    if (!event) {
      return new NotFoundError(`Event with type '${type}' not found.`)
    }

    return this.validateRevertById(event.id)
  }

  revert<TEventType extends keyof TEvents & string>(
    type: TEventType,
    payload: IResolvedPayload<
      TAttributes,
      TAttributeGroups,
      TEvents[TEventType]
    >
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
