import { ReactiveBase } from '@helper/ReactiveBase'
import { Referenceable } from '@models/Reference/Referenceable'
import { storeInstance } from '@store/data-store'
import { generate } from 'shortid'
import { jsonMember } from 'typedjson'

export class ReferenceableBase extends ReactiveBase implements Referenceable {
  static options = { onDeserialized: 'onDeserialized' }

  @jsonMember(String)
  public id: string = generate()

  // noinspection JSUnusedLocalSymbols
  protected onDeserialized(): void {
    storeInstance.addReference(this)
  }
}
