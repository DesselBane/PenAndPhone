import { CompositionSource } from '@models/Composition'
import { Displayable } from '@models/Displayable'

export interface Trait extends Displayable, CompositionSource<string> {}
