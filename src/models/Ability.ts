import { Composable, CompositionSource } from '@models/Composition'
import { Displayable } from '@models/Displayable'
import { Incrementable, IncrementableImpl } from '@models/Increments'
import { ReferenceableBase } from '@models/reference'
import { storeInstance } from '@store/data-store'
import { jsonArrayMember, jsonMember, jsonObject } from 'typedjson'

@jsonObject(ReferenceableBase.options)
export class Ability
  extends IncrementableImpl
  implements Composable<number>, Incrementable, Displayable
{
  @jsonMember(String)
  public readonly label: string

  @jsonArrayMember(String)
  private _compositionSourceIds: string[] = []

  public get compositionSources(): CompositionSource<number>[] {
    return this._compositionSourceIds.map((id) =>
      storeInstance.getReference(id)
    ) as CompositionSource<number>[]
  }

  public get value(): number {
    const composeValue = this.compositionSources.reduce(
      (previousValue, source) => previousValue + source.value,
      0
    )
    const incrementValue = this._increments.reduce(
      (previousValue, { amount }) => previousValue + amount,
      0
    )

    return composeValue + incrementValue
  }

  public addCompositionSource(
    source: CompositionSource<number> | undefined
  ): boolean {
    if (source == undefined || this._compositionSourceIds.includes(source.id)) {
      return false
    }

    this._compositionSourceIds.push(source.id)
    return true
  }

  public removeCompostionSource(
    source: CompositionSource<number> | undefined
  ): boolean {
    const index = this._compositionSourceIds.findIndex((x) => x === source?.id)

    if (index !== -1) {
      this._compositionSourceIds.splice(index, 1)
      return true
    }
    return false
  }

  constructor(label: string) {
    super()

    this.label = label
  }
}
