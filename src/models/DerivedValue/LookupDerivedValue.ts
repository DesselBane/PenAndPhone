import { jsonReferenceMember } from '@helper/jsonReferenceMember'
import { CompositionSource } from '@models/Composition'
import { DerivedValue } from '@models/DerivedValue/DerivedValue'
import { ReferenceableBase } from '@models/Reference'
import { jsonMapMember, jsonMember, jsonObject } from 'typedjson'

@jsonObject(ReferenceableBase.options)
export class LookupDerivedValue
  extends ReferenceableBase
  implements DerivedValue
{
  public get compositionSources(): CompositionSource<string>[] {
    return [this._compositionSource]
  }
  public get value(): number {
    const value = this._mappings.get(this._compositionSource.value)

    if (value == null) {
      throw new Error(
        `Could not find mapping for value: ${this._compositionSource.value}`
      )
    }

    return value
  }

  @jsonReferenceMember
  private readonly _compositionSource: CompositionSource<string>

  @jsonMapMember(String, Number)
  private _mappings: Map<string, number>

  @jsonMember(String)
  public readonly label: string

  constructor(
    label: string,
    compositionSource: CompositionSource<string>,
    mappings: Map<string, number>
  ) {
    super()
    this._compositionSource = compositionSource
    this._mappings = mappings

    this.label = label
  }
}
