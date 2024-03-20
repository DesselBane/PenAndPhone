import { Effect, EffectConfig } from './effect.ts'

export type UnknownItemConfig = ItemConfig<any, any, any>

export type ItemConfig<
  TEffectContext extends Record<string, unknown>,
  TItemDefinitionExtensions,
  TEffectDuration,
> = EffectConfig<TEffectContext, TEffectDuration> & {
  itemExtensions: TItemDefinitionExtensions
}

export type ItemDefinitions<TItemConfig extends UnknownItemConfig> = Record<
  string,
  ItemDefinition<TItemConfig>
>

export type ItemDefinition<TItemConfig extends UnknownItemConfig> = {
  description: string
  effects?: Effect<TItemConfig>[]
  extensions?: TItemConfig['itemExtensions'][]
}
