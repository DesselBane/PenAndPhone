import { Composable, CompositionSource } from '@models/composable'
import { Incrementable, IncrementableImpl } from '@models/increment'
import { ReferenceableBase } from '@models/reference'
import { jsonArrayMember, jsonObject } from 'typedjson'
import { computed, nextTick, reactive } from 'vue'
import { storeInstance } from '../store/data-store'

@jsonObject(ReferenceableBase.options)
export class Ability extends IncrementableImpl
  implements Composable, Incrementable {
  @jsonArrayMember(String)
  private _compositionSourceIds: string[] = []

  public compositionSources: CompositionSource[] = []

  constructor(name = '') {
    super(name)
    const that = reactive(this) as Ability

    nextTick(() => {
      that.compositionSources = (computed(() =>
        this._compositionSourceIds.map((id) => storeInstance.getReference(id))
      ) as unknown) as CompositionSource[]

      that.currentValue = (computed(() => {
        const composeValue = that.compositionSources.reduce(
          (previousValue, source) => previousValue + source.currentValue,
          0
        )
        const incrementValue = that._increments.reduce(
          (previousValue, { amount }) => previousValue + amount,
          0
        )

        return composeValue + incrementValue
      }) as unknown) as number
    })

    return that
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
