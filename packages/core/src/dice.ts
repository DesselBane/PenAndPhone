import { GameConfig } from './ruleset.ts'

export type UnknownDiceRollConfig = DiceRollConfig<any>

export type DiceRollConfig<TAvailableDice extends number> = Pick<
  GameConfig<never, never, never, never, never, TAvailableDice, never>,
  'availableDice'
>

export type DiceRoll<TDiceRollConfig extends UnknownDiceRollConfig> = {
  dice: TDiceRollConfig['availableDice'][]
  modifier: number
}

export type RollCheckDefinition<TAvailableAttributeIds extends string> =
  | TAvailableAttributeIds
  | number
