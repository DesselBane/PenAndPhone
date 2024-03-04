import { ValueOf } from 'type-fest'

export type ObjectToTuple<TSource extends Record<string, unknown>> = ValueOf<{
  [prop in keyof TSource & string]: [prop, TSource[prop]]
}>
