import { ReactiveBase } from '@helper/ReactiveBase'
import { storeInstance } from '@store/data-store'
import { generate } from 'shortid'
import { jsonMember } from 'typedjson'

export interface Referenceable {
  readonly id: string
  name: string
}

export class ReferenceableBase extends ReactiveBase implements Referenceable {
  static options = { onDeserialized: 'onDeserialized' }

  @jsonMember(String)
  public id: string = generate()

  @jsonMember(String)
  public name: string

  constructor(name = '') {
    super()
    this.name = name
  }

  // noinspection JSUnusedLocalSymbols
  protected onDeserialized(): void {
    storeInstance.addReference(this)
  }
}
