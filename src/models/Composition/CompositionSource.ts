import { Referenceable } from '@models/reference'

export interface CompositionSource<T> extends Referenceable {
  readonly value: T
}
