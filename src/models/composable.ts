import { Calculated } from '@models/calculated'
import { Referenceable } from '@models/reference'

export interface CompositionSource extends Calculated, Referenceable {}

export interface Composable extends Calculated {
  readonly compositionSources: CompositionSource[]
  addCompositionSource(source: CompositionSource): boolean
  removeCompostionSource(source: CompositionSource): boolean
}
