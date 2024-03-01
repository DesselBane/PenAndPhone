import { merge } from 'lodash-es'
import {
  AttributeDefinition as AttributeDefinitions,
  AttributeStateFromDefinitions,
  UnknownAttributeDefinition,
} from './attributes'
import type { ConditionalKeys, Except } from 'type-fest'
import { MergedWithTags, TagContainer } from './tags'
import { AbilityDfinitions } from './ability'

export type UnknownGameConfig = GameConfig<any, any, any, any, any, any>
export type GameConfig<
  TTimeUnitDefinition,
  TEffectDuration,
  TRangeDefinition,
  TAbilityCostDefinition,
  TPreconditionDefinition,
  TAbilityUpgradeType
> = {
  timeUnit: TTimeUnitDefinition
  effectDuration: TEffectDuration
  range: TRangeDefinition
  abilityCost: TAbilityCostDefinition
  precondition: TPreconditionDefinition
  abilityUpgradeTypes: TAbilityUpgradeType
}

export function createGameRuleSet<
  TTimeUnitDefinition,
  TEffectDuration,
  TRangeDefinition,
  TAbilityCostDefinition,
  TPreconditionDefinition,
  TAbilityUpgradeType
>() {
  return new GameRuleSet<
    GameConfig<
      TTimeUnitDefinition,
      TEffectDuration,
      TRangeDefinition,
      TAbilityCostDefinition,
      TPreconditionDefinition,
      TAbilityUpgradeType
    >,
    {},
    {}
  >({}, {})
}

export class GameRuleSet<
  TGameConfig extends UnknownGameConfig,
  TAttributeDefinition extends AttributeDefinitions<any>,
  TAbilityDefinition extends AbilityDfinitions<any>
> {
  gameConfig: TGameConfig | undefined
  attributes: TAttributeDefinition
  abilities: TAbilityDefinition

  constructor(
    attributeDefinition: TAttributeDefinition,
    abilityDefinition: TAbilityDefinition
  ) {
    this.attributes = attributeDefinition
    this.abilities = abilityDefinition
  }

  withFilter<
    const TFilter extends Partial<UnknownAttributeDefinition<any>>,
    const TNewAttributDefinition extends AttributeDefinitions<any>
  >(
    _filter: TFilter,
    callback: (
      filteredeCharDef: GameRuleSet<
        TGameConfig,
        Pick<
          TAttributeDefinition,
          ConditionalKeys<TAttributeDefinition, TFilter>
        >,
        TAbilityDefinition
      >
    ) => GameRuleSet<TGameConfig, TNewAttributDefinition, TAbilityDefinition>
  ): GameRuleSet<
    TGameConfig,
    TAttributeDefinition & TNewAttributDefinition,
    TAbilityDefinition
  > {
    // Typecasting is ok since the underlying definition can only be added to
    return callback(this) as any
  }

  addAttributes<
    const TTagContainer extends TagContainer,
    const TNewAttributeDefinition extends AttributeDefinitions<
      keyof TAttributeDefinition & string
    >
  >(
    definition: TNewAttributeDefinition,
    addToAll?: TTagContainer
  ): GameRuleSet<
    TGameConfig,
    TAttributeDefinition &
      MergedWithTags<TNewAttributeDefinition, TTagContainer>,
    TAbilityDefinition
  > {
    // TODO move this into a function and unit test it
    for (const key in definition) {
      definition[key] = merge({}, addToAll ?? {}, definition[key])
    }

    const mergedDefinition: MergedWithTags<
      TNewAttributeDefinition,
      TTagContainer
    > = definition as any

    return new GameRuleSet(
      {
        ...this.attributes,
        ...mergedDefinition,
      },
      this.abilities
    )
  }

  defineAbilityPreconditions<TAbilityPreconditions>(
    _conditions: (
      gameRuleSet: GameRuleSet<
        TGameConfig,
        TAttributeDefinition,
        TAbilityDefinition
      >
    ) => TAbilityPreconditions
  ): GameRuleSet<
    Except<TGameConfig, 'precondition'> & {
      precondition: TAbilityPreconditions
    },
    TAttributeDefinition,
    TAbilityDefinition
  > {
    return this
  }

  addAbilities<
    const TNewAbilityDefinition extends AbilityDfinitions<
      TGameConfig & {
        availableAttributIds: keyof TAttributeDefinition & string
        effectContext: AttributeStateFromDefinitions<TAttributeDefinition>
      }
    >
  >(
    newAbilities: TNewAbilityDefinition
  ): GameRuleSet<
    TGameConfig,
    TAttributeDefinition,
    TAbilityDefinition & TNewAbilityDefinition
  > {
    return new GameRuleSet(this.attributes, {
      ...this.abilities,
      ...newAbilities,
    })
  }
}
