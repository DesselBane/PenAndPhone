import { DiceRoll, UnknownGameConfig } from '@pen-and-phone/core'

export type UnkownWaffenConfig = WaffenConfig<any, any>

export type WaffenConfig<
  TWaffenFertigkeitIds extends string,
  TAttributIds extends string,
> = {
  attributeIds: TAttributIds
  waffenFertigkeiten: TWaffenFertigkeitIds
} & Pick<UnknownGameConfig, 'timeUnit' | 'availableDice'>

export type Scharf = {
  type: 'scharf'
  value: number
}
export type Durchdringung = {
  type: 'durchdringung'
  value: number
}
export type Reichweite = {
  type: 'reichweite'
  value: number
}

export type Waffenmerkmal = Scharf | Durchdringung | Reichweite

export type WaffenDefinition<TConfig extends UnkownWaffenConfig> = {
  type: 'waffe'
  sources: [
    fertigkeit: TConfig['waffenFertigkeiten'],
    attribut1: TConfig['attributeIds'],
    attribut2: TConfig['attributeIds'],
  ]
  geschwindigkeit: TConfig['timeUnit']
  damageRoll: DiceRoll<TConfig>
  merkmale?: Waffenmerkmal[]
}
