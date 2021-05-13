import { Composable, CompositionSource } from '@models/Composition'
import { Displayable } from '@models/Displayable'

export interface DerivedValue
  extends Displayable,
    CompositionSource<number>,
    Composable<number> {}
