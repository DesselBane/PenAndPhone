export type UnknownEffectConfig = EffectConfig<any, any>

export type EffectConfig<
  TEffectContext extends Record<string, unknown>,
  TEffectDuration
> = {
  effectDuration: TEffectDuration
  effectContext: TEffectContext
}

export type Effect<TEffectConfig extends UnknownEffectConfig> =
  | SimpleEffect<TEffectConfig>
  | ComplexEffect<TEffectConfig>

export type SimpleEffect<TEffectConfig extends UnknownEffectConfig> = {
  targetAttribut: keyof TEffectConfig['effectContext']
  operation: 'add' | 'subtract' | 'set'
  value: number
  duration: TEffectConfig['effectDuration']
}

export type ComplexEffect<TEffectConfig extends UnknownEffectConfig> = {
  (
    context: TEffectConfig['effectContext']
  ): readonly SimpleEffect<TEffectConfig>[]
}

export function generateEffects<TEffectConfig extends UnknownEffectConfig>(
  partialEffect: Pick<
    SimpleEffect<TEffectConfig>,
    'operation' | 'value' | 'duration'
  >,
  ...targetAttributes: (keyof TEffectConfig['effectContext'])[]
): SimpleEffect<TEffectConfig>[] {
  return targetAttributes.map(
    (targetAttribut) =>
      ({
        ...partialEffect,
        targetAttribut,
      } satisfies SimpleEffect<TEffectConfig>)
  )
}
