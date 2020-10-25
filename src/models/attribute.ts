import { Taggable } from '@models/tags'
import { computed, ComputedRef } from '@vue/reactivity'
import { jsonArrayMember, jsonMember, jsonObject } from 'typedjson'
import { Referenceable, ReferenceableBase } from './reference'
import { generate } from 'shortid'

export interface Increment extends Referenceable {
  readonly timestamp: number
  readonly amount: number
}

@jsonObject
class IncrementImpl implements Increment {
  @jsonMember
  public readonly amount: number
  @jsonMember
  public readonly id: string = generate()
  @jsonMember
  public readonly timestamp: number = Date.now()

  constructor(amount = 1) {
    this.amount = amount
  }
}

export interface Incrementable {
  readonly currentValue: ComputedRef<number>
  addIncrement(amount: number): Increment
  removeIncrement(id?: string): boolean
}

@jsonObject(ReferenceableBase.options)
export class Attribute extends ReferenceableBase
  implements Taggable, Incrementable {
  @jsonArrayMember(String)
  public tags: string[] = []
  @jsonMember
  public parentId: string = ''
  @jsonMember
  public label: string = ''

  @jsonArrayMember(IncrementImpl)
  private _increments: Increment[] = []

  public get increments(): Increment[] {
    return this._increments
  }

  public readonly currentValue = computed(() =>
    this.increments.reduce(
      (previousValue, { amount }) => previousValue + amount,
      0
    )
  )

  public addIncrement(amount = 1): Increment {
    const increment = new IncrementImpl(amount)
    this._increments.push(increment)
    return increment
  }

  public removeIncrement(id?: string): boolean {
    const incrementIndex = this._increments.findIndex((x) => x.id === id)

    if (incrementIndex === -1) {
      return false
    } else {
      this._increments.splice(incrementIndex, 1)
      return true
    }
  }
}
