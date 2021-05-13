import { CompositionSource } from '@models/Composition'
import { Increment } from '@models/Increments/increment'

export interface Incrementable extends CompositionSource<number> {
  readonly increments: Increment[]

  addIncrement(amount: number): Increment

  removeIncrement(id?: string): boolean
}
