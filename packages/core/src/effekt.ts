export type Effekt<TAttributId extends string> =
  | SimpleEffekt<TAttributId>
  | ComplexEffekt<TAttributId>

export type SimpleEffekt<TAttributId extends string> = {
  targetAttribut: TAttributId
  operation: 'add' | 'subtract' | 'set'
  value: number
}

export type ComplexEffekt<TAttributId extends string> = {
  (charData: Record<TAttributId, number>): readonly SimpleEffekt<TAttributId>[]
}
