import { ValueOf } from 'type-fest'
import { SimplifyDeep } from 'type-fest/source/merge-deep'

export type ObjectToTuple<TSource extends Record<string, unknown>> = ValueOf<{
  [prop in keyof TSource & string]: [prop, TSource[prop]]
}>
