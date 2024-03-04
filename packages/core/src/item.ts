import { Effect, EffectConfig } from './effect.ts'

export type UnknownItemConfig = ItemConfig<any, any>

export type ItemConfig<
  TEffectContext extends Record<string, unknown>,
  TEffectDuration,
> = EffectConfig<TEffectContext, TEffectDuration>

export type ItemDefinitions<TItemConfig extends UnknownItemConfig> = Record<
  string,
  ItemDefinition<TItemConfig>
>

export type ItemDefinition<TItemConfig extends UnknownItemConfig> = {
  description: string
  effects?: Effect<TItemConfig>[]
}
