import { computedProp } from '@helper/ReactiveBase'
import { Composable, CompositionSource } from '@models/composable'
import { Incrementable, IncrementableImpl } from '@models/increment'
import { ReferenceableBase } from '@models/reference'
import { storeInstance } from '@store/data-store'
import { jsonArrayMember, jsonObject } from 'typedjson'

@jsonObject(ReferenceableBase.options)
export class Ability
  extends IncrementableImpl
  implements Composable, Incrementable
{
  @jsonArrayMember(String)
  private _compositionSourceIds: string[] = []

  @computedProp
  public get compositionSources() {
    return this._compositionSourceIds.map((id) =>
      storeInstance.getReference(id)
    ) as CompositionSource[]
  }

  @computedProp
  public get currentValue() {
    const composeValue = this.compositionSources.reduce(
      (previousValue, source) => previousValue + source.currentValue,
      0
    )
    const incrementValue = this._increments.reduce(
      (previousValue, { amount }) => previousValue + amount,
      0
    )

    return composeValue + incrementValue
  }

  public addCompositionSource(source: CompositionSource | undefined): boolean {
    if (source == undefined || this._compositionSourceIds.includes(source.id)) {
      return false
    }

    this._compositionSourceIds.push(source.id)
    return true
  }

  public removeCompostionSource(
    source: CompositionSource | undefined
  ): boolean {
    const index = this._compositionSourceIds.findIndex((x) => x === source?.id)

    if (index !== -1) {
      this._compositionSourceIds.splice(index, 1)
      return true
    }
    return false
  }
}
