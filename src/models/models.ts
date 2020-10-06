import { computed, ComputedRef, unref, ref } from '@vue/reactivity'
import { jsonObject, jsonMember, jsonArrayMember } from 'typedjson'

declare type PPID = string
declare type LedgerID = number

@jsonObject
export class LedgerEntry {
  @jsonMember({ constructor: Number })
  public readonly ledgerId: LedgerID

  constructor() {
    this.ledgerId = Date.now()
  }
}

export interface AttributeModifier<TAttributeType extends number | string> {
  readonly modifyValue: TAttributeType
  readonly source?: PPID
}

@jsonObject
export class TextAttributeModifier extends LedgerEntry
  implements AttributeModifier<string> {
  @jsonMember({ constructor: String })
  public readonly modifyValue: string
  @jsonMember({ constructor: String })
  public readonly source?: PPID

  constructor(modifyValue: string, source?: PPID) {
    super()
    this.modifyValue = modifyValue
    this.source = source
  }
}

@jsonObject
export class NumberAttributeModifier extends LedgerEntry
  implements AttributeModifier<number> {
  @jsonMember({ constructor: Number })
  public readonly modifyValue: number
  @jsonMember({ constructor: String })
  public readonly source?: PPID

  constructor(modifyValue: number, source?: PPID) {
    super()
    this.modifyValue = modifyValue
    this.source = source
  }
}

export interface Attribute<TAttributeType extends string | number> {
  readonly modifiers: AttributeModifier<TAttributeType>[]
  readonly value: ComputedRef<TAttributeType>
  readonly id: PPID
  readonly label: string
}

@jsonObject
export class NumberAttribute implements Attribute<number> {
  @jsonArrayMember(NumberAttributeModifier)
  public readonly modifiers: AttributeModifier<number>[] = []
  public readonly value: ComputedRef<number>
  @jsonMember({ constructor: String })
  public readonly id: PPID
  @jsonMember({ constructor: String })
  public readonly label: string

  constructor(id: PPID, label: string, initialValue: number) {
    this.id = id
    this.label = label
    this.value = computed(() => {
      return this.modifiers.reduce(
        (accumulator, modifier) => accumulator + modifier.modifyValue,
        initialValue
      )
    })
  }
}

@jsonObject
export class TextAttribute implements Attribute<string> {
  @jsonArrayMember(TextAttributeModifier)
  public readonly modifiers: AttributeModifier<string>[] = []
  readonly value: ComputedRef<string>
  @jsonMember({ constructor: String })
  public readonly id: PPID
  @jsonMember({ constructor: String })
  public readonly label: string

  constructor(id: PPID, label: string, initialValue: string) {
    this.id = id
    this.label = label
    this.modifiers.push(new TextAttributeModifier(initialValue))
    this.value = computed(
      () => this.modifiers[this.modifiers.length - 1].modifyValue
    )
  }
}

@jsonObject
export class Character {
  @jsonMember({ constructor: String })
  public readonly id: PPID
  public readonly attributes = ref<Attribute<any>[]>([])

  @jsonArrayMember(TextAttribute)
  public get textAttributes(): TextAttribute[] {
    return (
      unref(this.attributes)?.filter((x) => x instanceof TextAttribute) || []
    )
  }
  private set textAttributes(values: TextAttribute[]) {
    unref(this.attributes).push(...values)
  }

  @jsonArrayMember(NumberAttribute)
  private get numberAttributes(): NumberAttribute[] {
    return (
      unref(this.attributes)?.filter((x) => x instanceof NumberAttribute) || []
    )
  }
  private set numberAttributes(values: NumberAttribute[]) {
    unref(this.attributes).push(...values)
  }

  constructor(id: PPID) {
    this.id = id
  }
}
