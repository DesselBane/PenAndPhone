import { Effekt } from './effekt'

export type RollCheckDefinition<TAvailableAttributeIds extends string> =
  | TAvailableAttributeIds
  | number

export type AbilityUpgradeDefinition<
  TEffektContext extends Record<string, unknown>,
  TAbilityCostDefinition,
  TAbilityUpgradeType
> = {
  cost: readonly TAbilityCostDefinition[]
  effekt: readonly Effekt<TEffektContext>[]
  effektDescription?: string
  upgradeType: TAbilityUpgradeType
}

export type AbilityDfinitions<
  TEffektContext extends Record<string, unknown>,
  TTimeUnitDefinition,
  TRangeDefinition,
  TAbilityCostDefinition,
  TPreconditionDefinition,
  TAbilityUpgradeType,
  TAvailableAttributeIds extends string,
  TAbilityUpgradeCostDefinition = TAbilityCostDefinition
> = Record<
  string,
  AbilityDefinition<
    TEffektContext,
    TTimeUnitDefinition,
    TRangeDefinition,
    TAbilityCostDefinition,
    TPreconditionDefinition,
    TAbilityUpgradeType,
    TAvailableAttributeIds,
    TAbilityUpgradeCostDefinition
  >
>

export type AbilityDefinition<
  TEffektContext extends Record<string, unknown>,
  TTimeUnitDefinition,
  TRangeDefinition,
  TAbilityCostDefinition,
  TPreconditionDefinition,
  TAbilityUpgradeType,
  TAvailableAttributeIds extends string,
  TAbilityUpgradeCostDefinition = TAbilityCostDefinition
> = {
  preconditions: readonly TPreconditionDefinition[]
  cost: TAbilityCostDefinition
  rollDifficulty: RollCheckDefinition<TAvailableAttributeIds>
  range: TRangeDefinition
  castDuration: TTimeUnitDefinition
  effekt: readonly Effekt<TEffektContext>[]
  effektDescription?: string
  upgrades?: readonly AbilityUpgradeDefinition<
    TEffektContext,
    TAbilityUpgradeCostDefinition,
    TAbilityUpgradeType
  >[]
}
