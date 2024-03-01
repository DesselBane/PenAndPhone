export type Effekt<TEffektContext extends Record<string, unknown>> =
  | SimpleEffekt<TEffektContext>
  | ComplexEffekt<TEffektContext>

export type SimpleEffekt<TEffektContext extends Record<string, unknown>> = {
  targetAttribut: keyof TEffektContext
  operation: 'add' | 'subtract' | 'set'
  value: number
}

export type ComplexEffekt<TEffektContext extends Record<string, unknown>> = {
  (context: TEffektContext): readonly SimpleEffekt<TEffektContext>[]
}

export function generateEffects<TEffektContext extends Record<string, unknown>>(
  partialEffekt: Pick<SimpleEffekt<TEffektContext>, 'operation' | 'value'>,
  ...targetAttributes: (keyof TEffektContext)[]
): SimpleEffekt<TEffektContext>[] {
  return targetAttributes.map(
    (targetAttribut) =>
      ({
        targetAttribut,
        operation: partialEffekt.operation,
        value: partialEffekt.value,
      } satisfies SimpleEffekt<TEffektContext>)
  )
}
