import { isNullOrWhitespace } from '@helper/StringHelpers'
import { Displayable } from '@models/Displayable'
import { jsonArrayMember, jsonMember, jsonObject } from 'typedjson'

export interface Trait<T> extends Displayable {
  readonly value: T
}

@jsonObject
export class SimpleTrait implements Trait<string> {
  @jsonMember(String)
  public readonly label: string

  @jsonMember(String)
  public value: string

  constructor(label: string, value?: string) {
    this.label = label
    this.value = value || ''
  }
}

export class SelectableTrait implements Trait<string> {
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
    this.label = label
    this.options = options
    this.value = value || ''
  }
}
