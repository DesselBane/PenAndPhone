import { nanoid } from 'nanoid'
import { AttributeKey } from './Attribute'
import { AddExp, Entry, Ledger, NameChange, PurchaseAttribute } from './ledger'

const attributeCosts = {
  1: 10,
  2: 15,
  3: 20,
  4: 25,
}

function getAttributeCosts(purchasedHowOften: number): number | Error {
  if (purchasedHowOften >= 4) {
    return new Error('Cannot purchase any more of this')
  }

  return attributeCosts[purchasedHowOften as keyof typeof attributeCosts]
}

export class Character extends Ledger {
  readonly id: string = nanoid()
  private _name: string = ''
  private _totalExp: number = 0
  private _spentExp: number = 0

  // Attributes
  private _agility: number = 0
  private _constitution: number = 0

  get name(): string {
    return this._name
  }

  set name(value: string) {
    this.appendEntry(new NameChange(value))
  }

  get totalExp() {
    return this._totalExp
  }

  get level() {
    if (this._spentExp < 100) {
      return 1
    }

    if (this._spentExp < 300) {
      return 2
    }

    if (this._spentExp < 600) {
      return 3
    }

    return 4
  }

  get agility() {
    return this._agility
  }

  get constitution() {
    return this._constitution
  }

  addExp(howMuch: number) {
    this.appendEntry(new AddExp(howMuch))
  }

  purchase(attributeKey: AttributeKey) {
    this.appendEntry(new PurchaseAttribute(attributeKey))
  }

  protected appendEntry(entry: Entry): Error | void {
    super.appendEntry(entry)
    let error: Error | void | null = null

    switch (entry.kind) {
      case NameChange.KIND:
        this.handleNameChange(entry as NameChange)
        break
      case AddExp.KIND:
        this.handleAddExp(entry as AddExp)
        break
      case PurchaseAttribute.KIND:
        error = this.handlePurchaseAttribute(entry as PurchaseAttribute)
        break
      default:
        console.log('Unknown Event detected')
    }

    if (error != null) {
      return error
    }
  }

  protected handleNameChange(entry: NameChange) {
    this._name = entry.value
  }

  protected handleAddExp(entry: AddExp) {
    this._totalExp += entry.value
  }

  protected handlePurchaseAttribute(entry: PurchaseAttribute): Error | void {
    const purchasedHowOften = this[entry.attribute] + 1
    const costs = getAttributeCosts(purchasedHowOften)

    if (costs instanceof Error) {
      return costs
    }
    if (this._spentExp + costs > this._totalExp) {
      return new Error('Not enough exp available, pls stock up on that shit')
    }

    this[`_${entry.attribute}`] += 1
    this._spentExp += costs
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      totalExp: this._totalExp,
      spentExp: this._spentExp,
      attributes: {
        agility: this._agility,
        constitution: this._constitution,
      },
    }
  }
}
