export interface LedgerEntryKindMap {
  [NameChange.KIND]: NameChange
  [AddExp.KIND]: AddExp
  [PurchaseAgility.KIND]: PurchaseAgility
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

export class PurchaseAgility extends Entry {
  static KIND: 'purchase-agility' = 'purchase-agility'
  readonly kind = PurchaseAgility.KIND

  constructor() {
    super()
  }
}
