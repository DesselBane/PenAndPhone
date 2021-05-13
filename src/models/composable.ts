import { Calculated } from '@models/calculated'
import { Referenceable } from '@models/reference'
import shortid from 'shortid'

export interface CompositionSource extends Calculated, Referenceable {}

export interface Composable extends Calculated {
  readonly compositionSources: CompositionSource[]
}

export class StaticCompositionSource implements CompositionSource {
  public readonly currentValue: number
  public readonly id: string = shortid()

  constructor(value: number) {
    this.currentValue = value
  }
}
