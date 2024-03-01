import { Effect, EffectConfig } from './effect'

export type RollCheckDefinition<TAvailableAttributeIds extends string> =
  | TAvailableAttributeIds
  | number

export type UnknownAbillityConfig = AbillityConfig<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>
export type AbillityConfig<
  TTimeUnitDefinition,
  TEffectDuration,
  TEffectContext extends Record<string, unknown>,
  TRangeDefinition,
  TAbilityCostDefinition,
  TPreconditionDefinition,
  TAbilityUpgradeType,
  TAvailableAttributeIds extends string
> = {
  timeUnit: TTimeUnitDefinition
  range: TRangeDefinition
  abilityCost: TAbilityCostDefinition
  precondition: TPreconditionDefinition
  abilityUpgradeTypes: TAbilityUpgradeType
  availableAttributIds: TAvailableAttributeIds
} & EffectConfig<TEffectContext, TEffectDuration>

export type AbilityUpgradeDefinition<
  TAbillityUpgradeConfig extends Pick<
    UnknownAbillityConfig,
    'abilityCost' | 'abilityUpgradeTypes' | 'effectDuration' | 'effectContext'
  >
> = {
  cost: TAbillityUpgradeConfig['abilityCost'][]
  effect: readonly Effect<TAbillityUpgradeConfig>[]
  effectDescription?: string
  upgradeType: TAbillityUpgradeConfig['abilityUpgradeTypes']
}

export type AbilityDfinitions<TAbilityConfig extends UnknownAbillityConfig> =
  Record<string, AbilityDefinition<TAbilityConfig>>

export type AbilityDefinition<TAbilityConfig extends UnknownAbillityConfig> = {
  preconditions: readonly TAbilityConfig['precondition'][]
  cost: TAbilityConfig['abilityCost'][]
  rollDifficulty: RollCheckDefinition<TAbilityConfig['availableAttributIds']>
  range: TAbilityConfig['range']
  castDuration: TAbilityConfig['timeUnit']
  effect: readonly Effect<TAbilityConfig>[]
  effectDescription?: string
  upgrades?: readonly AbilityUpgradeDefinition<TAbilityConfig>[]
}
