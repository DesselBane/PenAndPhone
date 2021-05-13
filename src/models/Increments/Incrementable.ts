import { Calculated } from '@models/Calculated'
import { Increment } from '@models/Increments/increment'
import { Referenceable } from '@models/reference'

export interface Incrementable extends Referenceable, Calculated {
  readonly increments: Increment[]

  addIncrement(amount: number): Increment

  removeIncrement(id?: string): boolean
}
