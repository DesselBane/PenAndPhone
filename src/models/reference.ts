import { ReactiveBase } from '@helper/ReactiveBase'
import { generate } from 'shortid'
import { jsonMember } from 'typedjson'
import { storeInstance } from '../store/data-store'

export interface Referenceable {
  readonly id: string
  name: string
}

export class ReferenceableBase extends ReactiveBase implements Referenceable {
  static options = { onDeserialized: 'onDeserialized' }

  @jsonMember
  public id: string = generate()

  @jsonMember
  public name: string

  constructor(name = '') {
    super()
    this.name = name
  }

  // noinspection JSUnusedLocalSymbols
  protected onDeserialized() {
    storeInstance.addReference(this)
  }
}
