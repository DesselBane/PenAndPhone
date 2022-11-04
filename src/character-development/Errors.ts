import {
  UnknownAttributeDefinitions,
  AttributeGroupDefinitions,
} from './AttributeDefinition'
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
}
