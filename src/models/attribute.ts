import { Character } from '@models/character'
import { Modifiable, Modification } from '@models/modification'
import { Taggable } from '@models/tags'
import { computed, ComputedRef, unref } from '@vue/reactivity'
import { jsonArrayMember, jsonMember, jsonObject } from 'typedjson'
import { storeInstance } from '../store/data-store'
import { ReferenceableBase } from './reference'

@jsonObject(ReferenceableBase.options)
export class Attribute extends ReferenceableBase
  implements Taggable, Modifiable {
  @jsonArrayMember(String)
  public tags: string[] = []
  @jsonMember
  public parentId: string = ''
  @jsonMember
  public label: string = ''

  public readonly canAddModification: ComputedRef<boolean> = computed(
    () => true
  )
  public readonly canRemoveModification: ComputedRef<boolean> = computed(
    () => true
  )
  public readonly modifications: ComputedRef<Modification[]> = computed(
    () =>
      unref(this.parent)?.modifications?.filter(
        (mod) => mod.targetId === this.id
      ) || []
  )

  public readonly parent = computed(() =>
    this.parentId == null
      ? null
      : (storeInstance.getReference(this.parentId) as Character)
  )

  public readonly currentValue = computed(() =>
    unref(this.modifications).reduce(
      (previousValue, currentValue) => previousValue + currentValue.amount,
      0
    )
  )

  public addModification(): Modification | null {
    const parent = unref(this.parent)
    if (parent == null) {
      return null
    }

    const mod = new Modification()
    mod.targetId = this.id
    mod.amount = 1
    parent.addModification(mod)
    return mod
  }

  public removeModification(): boolean {
    const parent = unref(this.parent)
    const modifications = unref(this.modifications)

    if (parent == null || modifications.length === 0) {
      return false
    }

    const mod = modifications[modifications.length - 1]

    return parent.removeModification(mod)
  }
}
