import {
  UnknownAttributeDefinitions,
  AttributeGroupDefinitions,
} from './Attributes'
import { EventId, EventInstance, EventDefinitions } from './Events'
export class NotFoundError extends Error {}
export class ValidationError extends Error {}

export class RevertError<
  TAttributes extends UnknownAttributeDefinitions,
  TAttributeGroups extends AttributeGroupDefinitions<TAttributes>,
  TEvents extends EventDefinitions<TAttributes, TAttributeGroups>
> extends Error {
  errors: [EventId, ValidationError][] = []
  context: Record<
    EventId,
    EventInstance<TAttributes, TAttributeGroups, TEvents>
  > = {}

  constructor() {
    super()
  }

  add(
    event: EventInstance<TAttributes, TAttributeGroups, TEvents>,
    error: ValidationError
  ) {
    this.errors.push([event.id, error])
    this.context[event.id] = event
  }

  get message() {
    return this.errors
      .map(([id, error]) => {
        const event = this.context[id]
        return `Would result in rejection of "${
          event.type
        }" with payload "${JSON.stringify(event.payload)}" and id "${id}": ${
          error.message
        }`
      })
      .join(' | ')
  }
}
