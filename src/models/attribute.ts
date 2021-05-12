import { CompositionSource } from '@models/composable'
import { Incrementable, IncrementableImpl } from '@models/increment'
import { jsonObject } from 'typedjson'
import { ReferenceableBase } from './reference'

@jsonObject(ReferenceableBase.options)
export class Attribute
  extends IncrementableImpl
  implements Incrementable, CompositionSource {}
