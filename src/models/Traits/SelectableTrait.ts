import { isNullOrWhitespace } from '@helper/StringHelpers'
import { ReferenceableBase } from '@models/Reference'
import { Trait } from '@models/Traits/Trait'
import { jsonArrayMember, jsonMember, jsonObject } from 'typedjson'

@jsonObject(ReferenceableBase.options)
export class SelectableTrait extends ReferenceableBase implements Trait {
  @jsonMember(String)
  public readonly label: string

  @jsonArrayMember(String)
  public readonly options: string[] = []

  @jsonMember(String)
  private _value: string = ''

  public get value(): string {
    return this._value
  }

  public set value(value: string) {
    if (isNullOrWhitespace(value)) {
      this._value = ''
      return
    }

    if (!this.options.includes(value)) {
      throw new Error(
        `Set value <<${value}>> is not part of options <<${JSON.stringify(
          this.options
        )}>>`
      )
    }

    this._value = value
  }

  constructor(label: string, options: string[], value?: string) {
    super()
    this.label = label
    this.options = options
    this.value = value || ''
  }
}
