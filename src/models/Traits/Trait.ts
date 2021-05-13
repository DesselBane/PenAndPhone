import { Displayable } from '@models/Displayable'

export interface Trait<T> extends Displayable {
  readonly value: T
}
