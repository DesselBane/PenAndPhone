import { CompositionSource } from '@models/composable'
import { ReferenceableBase } from '@models/reference'
import { jsonMember, jsonObject } from 'typedjson'

export enum Races {
  Alb = 'Alb',
  Gnom = 'Gnom',
  Mensch = 'Mensch',
  Varg = 'Varg',
  Zwerg = 'Zwerg',
}

@jsonObject(ReferenceableBase.options)
export class Race extends ReferenceableBase implements CompositionSource {
  @jsonMember({ constructor: String })
  private readonly _race: Races = Races.Alb

  public get name() {
    return this._race
  }
  public set name(value: string) {
    if (value != null && value.trim() !== '') {
      console.error('The name should not be set on a race')
    }
  }

  public get currentValue() {
    switch (this._race) {
      case Races.Alb:
        return 5
      case Races.Gnom:
        return 3
      case Races.Mensch:
        return 5
      case Races.Varg:
        return 6
      case Races.Zwerg:
        return 4
      default:
        return Number.MIN_VALUE
    }
  }

  constructor(race: Races) {
    super()

    // Initialized by typedJSON
    if (race == undefined) {
      return
    }

    this._race = race
  }
}
