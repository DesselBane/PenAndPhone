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

  public addModification(): Modification | null {
    return null
  }

  public removeModification(): boolean {
    return false
  }
}
