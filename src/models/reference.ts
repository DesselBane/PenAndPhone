import { ReactiveBase } from '@helper/ReactiveBase'
import { storeInstance } from '@store/data-store'
import { generate } from 'shortid'
import { jsonMember } from 'typedjson'

export interface Referenceable {
  readonly id: string
}

export class ReferenceableBase extends ReactiveBase implements Referenceable {
  static options = { onDeserialized: 'onDeserialized' }

  @jsonMember(String)
  public id: string = generate()

  // noinspection JSUnusedLocalSymbols
  protected onDeserialized(): void {
    storeInstance.addReference(this)
  }
}
