import { CompositionSource } from '@models/Composition/CompositionSource'

export interface Composable<T> extends CompositionSource<T> {
  readonly compositionSources: CompositionSource<unknown>[]
}
