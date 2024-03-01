import { merge } from 'lodash-es'
import {
  AttributeDefinition as AttributeDefinitions,
  AttributeStateFromDefinitions,
  UnknownAttributeDefinition,
} from './attributes'
import type { ConditionalKeys, SetFieldType } from 'type-fest'
import { MergedWithTags, TagContainer } from './tags'
import { AbilityDfinitions } from './ability'
import {
  CostDefinition,
  OnlyAttributDefinitions,
  ResourceDefinitions,
  onlyAttributeDefinitions,
} from './resources'

export type UnknownGameConfig = GameConfig<any, any, any, any, any>
export type GameConfig<
  TTimeUnitDefinition,
  TEffectDuration,
  TRangeDefinition,
  TPreconditionDefinition,
  TAbilityUpgradeType
> = {
  timeUnit: TTimeUnitDefinition
  effectDuration: TEffectDuration
  range: TRangeDefinition
  precondition: TPreconditionDefinition
  abilityUpgradeTypes: TAbilityUpgradeType
}

type UnknwonGame = Game<UnknownGameConfig, any, any, any>
type Game<
  TGameConfig extends UnknownGameConfig,
  TAttributDefinitions extends AttributeDefinitions<any>,
  TAbilityDefinitions extends AbilityDfinitions<any>,
  TResourceDefinitions extends ResourceDefinitions<any>
> = {
  config: TGameConfig
  attributes: TAttributDefinitions
  abilities: TAbilityDefinitions
  resources: TResourceDefinitions
}

export function createGameRuleSet<
  TTimeUnitDefinition,
  TEffectDuration,
  TRangeDefinition,
  TPreconditionDefinition,
  TAbilityUpgradeType
>() {
  return new GameRuleSet<
    Game<
      GameConfig<
        TTimeUnitDefinition,
        TEffectDuration,
        TRangeDefinition,
        TPreconditionDefinition,
        TAbilityUpgradeType
      >,
      {},
      {},
      {}
    >
  >({}, {}, {})
}

export class GameRuleSet<TGame extends UnknwonGame> {
  gameConfig?: TGame['config']
  attributes: TGame['attributes']
  abilities: TGame['abilities']

  resources: TGame['resources']

  constructor(
    attributeDefinition: TGame['attributes'],
    abilityDefinition: TGame['abilities'],
    resources: TGame['resources']
  ) {
    this.attributes = attributeDefinition
    this.abilities = abilityDefinition
    this.resources = resources
  }

  withFilter<
    const TFilter extends Partial<UnknownAttributeDefinition<any>>,
    const TNewAttributDefinition extends AttributeDefinitions<any>
  >(
    _filter: TFilter,
    callback: (
      filteredeCharDef: GameRuleSet<
        SetFieldType<
          TGame,
          'attributes',
          Pick<
            TGame['attributes'],
            ConditionalKeys<TGame['attributes'], TFilter>
          >
        >
      >
    ) => GameRuleSet<SetFieldType<TGame, 'attributes', TNewAttributDefinition>>
  ): GameRuleSet<
    TGame & {
      attributes: TNewAttributDefinition
    }
  > {
    // Typecasting is ok since the underlying definition can only be added to
    return callback(this) as any
  }

  addAttributes<
    const TTagContainer extends TagContainer,
    const TNewAttributeDefinition extends AttributeDefinitions<
      keyof TGame['attributes'] & string
    >
  >(
    definition: TNewAttributeDefinition,
    addToAll?: TTagContainer
  ): GameRuleSet<
    TGame & {
      attributes: MergedWithTags<TNewAttributeDefinition, TTagContainer>
    }
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
      this.abilities,
      this.resources
    )
  }

  addResources<
    const TNewResourceDefinition extends ResourceDefinitions<{
      availableAttributIds: keyof TGame['attributes'] & string
    }>
  >(
    newResources: TNewResourceDefinition
  ): GameRuleSet<
    TGame & {
      attributes: OnlyAttributDefinitions<TNewResourceDefinition>
      resources: TNewResourceDefinition
    }
  > {
    const newAttributeDefinitions = onlyAttributeDefinitions(newResources)

    return new GameRuleSet(
      {
        ...this.attributes,
        ...newAttributeDefinitions,
      },
      this.abilities,
      {
        ...this.resources,
        ...newResources,
      }
    )
  }

  defineAbilityPreconditions<TAbilityPreconditions>(
    _conditions: (gameRuleSet: GameRuleSet<TGame>) => TAbilityPreconditions
  ): GameRuleSet<
    SetFieldType<
      TGame,
      'config',
      SetFieldType<TGame['config'], 'precondition', TAbilityPreconditions>
    >
  > {
    return this as any
  }

  addAbilities<
    const TNewAbilityDefinition extends AbilityDfinitions<
      TGame['config'] & {
        availableAttributIds: keyof TGame['attributes'] & string
        effectContext: AttributeStateFromDefinitions<TGame['attributes']>
        abilityCost: CostDefinition<TGame['resources']>
      }
    >
  >(
    newAbilities: TNewAbilityDefinition
  ): GameRuleSet<
    TGame & {
      abilities: TNewAbilityDefinition
    }
  > {
    return new GameRuleSet(
      this.attributes,
      {
        ...this.abilities,
        ...newAbilities,
      },
      this.resources
    )
  }
}
