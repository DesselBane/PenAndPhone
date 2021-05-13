import { Calculated } from '@models/calculated'
import { CompositionSource } from '@models/Composition/CompositionSource'

export interface Composable extends Calculated {
  readonly compositionSources: CompositionSource[]
}
