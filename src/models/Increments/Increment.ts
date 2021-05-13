import { Referenceable } from '@models/reference'

export interface Increment extends Referenceable {
  readonly timestamp: number
  readonly amount: number
}
