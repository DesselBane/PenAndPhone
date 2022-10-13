import { AttributeKey } from '../Attribute'

export interface LedgerEntryKindMap {
  [NameChange.KIND]: NameChange
  [AddExp.KIND]: AddExp
  [PurchaseAttribute.KIND]: PurchaseAttribute
}

export abstract class Entry {
  timestamp: Date
  abstract kind: keyof LedgerEntryKindMap

  protected constructor() {
    this.timestamp = new Date()
  }
}

export class NameChange extends Entry {
  static KIND: 'name-change' = 'name-change'
  readonly kind = NameChange.KIND
  value: string

  constructor(value: string) {
    super()
    this.value = value
  }
}

export class AddExp extends Entry {
  static KIND: 'add-exp' = 'add-exp'
  readonly kind = AddExp.KIND
  value: number

  constructor(value: number) {
    super()

    this.value = value
  }
}

export class PurchaseAttribute extends Entry {
  static KIND: 'purchase-attribute' = 'purchase-attribute'
  readonly kind = PurchaseAttribute.KIND
  attribute: AttributeKey

  constructor(attribute: AttributeKey) {
    super()

    this.attribute = attribute
  }
}
