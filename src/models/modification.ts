import { computed, ComputedRef } from '@vue/reactivity'
import { jsonMember, jsonObject } from 'typedjson'
import { storeInstance } from '../store/data-store'
import { Referenceable, ReferenceableBase } from './reference'

export interface Modifiable extends Referenceable {
  readonly modifications: ComputedRef<Modification[]>
  readonly canAddModification: ComputedRef<boolean>
  readonly canRemoveModification: ComputedRef<boolean>
  addModification(): Modification | null
  removeModification(): boolean
}

@jsonObject(ReferenceableBase.options)
export class Modification extends ReferenceableBase {
  @jsonMember
  public readonly timestamp: number = Date.now()

  @jsonMember
  public sourceId: string = ''

  @jsonMember
  public targetId: string = ''

  public readonly source = computed(() =>
    this.sourceId == null ? null : storeInstance.getReference(this.sourceId)
  )
  public readonly target = computed(() =>
    this.targetId == null ? null : storeInstance.getReference(this.targetId)
  )

  @jsonMember
  public amount: number = 0
}
