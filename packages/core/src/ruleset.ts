import { merge } from 'lodash-es'
import type { ConditionalKeys, SetFieldType } from 'type-fest'
import { AbilityDfinitions } from './ability'
import {
  AttributeDefinition as AttributeDefinitions,
  AttributeStateFromDefinitions,
  UnknownAttributeDefinition,
} from './attributes'
import { ItemDefinitions } from './item.ts'
import {
  CostDefinition,
  OnlyAttributDefinitions,
  ResourceDefinitions,
  onlyAttributeDefinitions,
} from './resources'
import { MergedWithTags, TagContainer } from './tags'

export type UnknownGameConfig = GameConfig<any, any, any, any, any>
export type GameConfig<
  TTimeUnitDefinition,
  TEffectDuration,
  TRangeDefinition,
  TPreconditionDefinition,
  TAbilityUpgradeType,
> = {
  timeUnit: TTimeUnitDefinition
  effectDuration: TEffectDuration
  range: TRangeDefinition
  precondition: TPreconditionDefinition
  abilityUpgradeTypes: TAbilityUpgradeType
}

type UnknwonGame = Game<UnknownGameConfig, any, any, any, any>
type Game<
  TGameConfig extends UnknownGameConfig,
  TAttributDefinitions extends AttributeDefinitions<any>,
  TAbilityDefinitions extends AbilityDfinitions<any>,
  TResourceDefinitions extends ResourceDefinitions<any>,
  TItemDefintions extends ItemDefinitions<any>,
> = {
  config: TGameConfig
  attributes: TAttributDefinitions
  abilities: TAbilityDefinitions
  resources: TResourceDefinitions
  items: TItemDefintions
}

export function createGameRuleSet<
  TTimeUnitDefinition,
  TEffectDuration,
  TRangeDefinition,
  TPreconditionDefinition,
  TAbilityUpgradeType,
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
      {},
      {}
    >
  >({}, {}, {}, {})
}

export class GameRuleSet<TGame extends UnknwonGame> {
  config?: TGame['config']
  attributes: TGame['attributes']
  abilities: TGame['abilities']
  resources: TGame['resources']
  items: TGame['items']

  constructor(
    attributeDefinition: TGame['attributes'],
    abilityDefinition: TGame['abilities'],
    resources: TGame['resources'],
    items: TGame['items']
  ) {
    this.attributes = attributeDefinition
    this.abilities = abilityDefinition
    this.resources = resources
    this.items = items
  }

  withFilter<
    const TFilter extends Partial<UnknownAttributeDefinition<any>>,
    const TNewAttributDefinition extends AttributeDefinitions<any>,
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
    >,
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

    return this.extend({
      attributes: mergedDefinition,
    })
  }

  addResources<
    const TNewResourceDefinition extends ResourceDefinitions<{
      availableAttributIds: keyof TGame['attributes'] & string
    }>,
  >(
    newResources: TNewResourceDefinition
  ): GameRuleSet<
    TGame & {
      attributes: OnlyAttributDefinitions<TNewResourceDefinition>
      resources: TNewResourceDefinition
    }
  > {
    const newAttributeDefinitions = onlyAttributeDefinitions(newResources)

    return this.extend({
      attributes: newAttributeDefinitions,
      resources: newResources,
    })
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
    >,
  >(
    newAbilities: TNewAbilityDefinition
  ): GameRuleSet<
    TGame & {
      abilities: TNewAbilityDefinition
    }
  > {
    return this.extend({
      abilities: newAbilities,
    })
  }

  addItems<
    const TNewItemDefinition extends ItemDefinitions<
      TGame['config'] & {
        effectContext: AttributeStateFromDefinitions<TGame['attributes']>
      }
    >,
  >(newItems: TNewItemDefinition) {
    return this.extend({
      items: newItems,
    })
  }

  private extend<const TNewGame extends UnknwonGame>(
    newData: Partial<TNewGame>
  ): GameRuleSet<TGame & TNewGame> {
    return new GameRuleSet(
      {
        ...this.attributes,
        ...newData.attributes,
      },
      {
        ...this.abilities,
        ...newData.abilities,
      },
      {
        ...this.resources,
        ...newData.resources,
      },
      {
        ...this.items,
        ...newData.items,
      }
    )
  }
}
