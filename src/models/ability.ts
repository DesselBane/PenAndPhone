import { Composable, CompositionSource } from '@models/composable'
import { ReferenceableBase } from '@models/reference'
import { jsonArrayMember, jsonMember } from 'typedjson'
import { computed, reactive } from 'vue'
import { storeInstance } from '../store/data-store'

export class Ability extends ReferenceableBase implements Composable {
  @jsonMember
  public label: string = ''

  @jsonArrayMember(String)
  private _compositionSourceId: string[] = []

  public compositionSources: CompositionSource[] = []
  public currentValue = 0

  constructor(label = '') {
    super()

    const that = reactive(this) as Ability

    that.compositionSources = (computed(() =>
      this._compositionSourceId.map((id) => storeInstance.getReference(id))
    ) as unknown) as CompositionSource[]

    that.currentValue = (computed(() =>
      this.compositionSources.reduce(
        (previousValue, source) => previousValue + source.currentValue,
        0
      )
    ) as unknown) as number

    that.label = label

    return that
  }

  public addCompositionSource(source: CompositionSource): boolean {
    if (this._compositionSourceId.includes(source.id)) {
      return false
    }

    this._compositionSourceId.push(source.id)
    return true
  }

  public removeCompostionSource(source: CompositionSource): boolean {
    const index = this._compositionSourceId.findIndex((x) => x === source.id)

    if (index !== -1) {
      this._compositionSourceId.splice(index, 1)
      return true
    }
    return false
  }
}
