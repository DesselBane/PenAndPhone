type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

export type NumberAttributeDefinition = {
  type: 'number'
}

export type NumberAttributeMutation = {
  type: 'add' | 'subtract'
  amount: number
}

export type TextAttributeDefinition = {
  type: 'text'
}

export type TextAttributeMutation = {
  value: string
}

export type SingleSelectAttributeDefinition = {
  type: 'single-select'
  options: ReadonlyArray<string | number>
}

export type SingleSelectAttributeMutation<
  TAttributeDefinition extends SingleSelectAttributeDefinition
> = {
  option: TAttributeDefinition['options'][number]
}

export type MultiSelectAttributeDefinition = {
  type: 'multi-select'
  options: ReadonlyArray<string | number>
}

export type MultiSelectAttributeMutation<
  TAttributeDefinition extends MultiSelectAttributeDefinition
> = {
  type: 'add' | 'remove'
  option: TAttributeDefinition['options'][number]
}

export type UnknownAttributeDefinition =
  | NumberAttributeDefinition
  | TextAttributeDefinition
  | SingleSelectAttributeDefinition
  | MultiSelectAttributeDefinition

export type AttributeMutation<
  TAttributeDefinition extends UnknownAttributeDefinition
> = UnionToIntersection<
  TAttributeDefinition extends TextAttributeDefinition
    ? TextAttributeMutation
    : TAttributeDefinition extends NumberAttributeDefinition
    ? NumberAttributeMutation
    : TAttributeDefinition extends SingleSelectAttributeDefinition
    ? SingleSelectAttributeMutation<TAttributeDefinition>
    : TAttributeDefinition extends MultiSelectAttributeDefinition
    ? MultiSelectAttributeMutation<TAttributeDefinition>
    : never
>

export type KeyedAttributeMutation<
  TAttributes extends UnknownAttributeDefinitions,
  TKey extends keyof TAttributes = keyof TAttributes
> = {
  key: TKey
  mutation: AttributeMutation<TAttributes[TKey]>
}

export type KeyedAttributeMutations<
  TAttributes extends UnknownAttributeDefinitions
> = KeyedAttributeMutation<TAttributes>[]

export type UnknownAttributeDefinitions = Record<
  string,
  UnknownAttributeDefinition
>

export type AttributeValue<TAttribute extends UnknownAttributeDefinition> =
  TAttribute extends SingleSelectAttributeDefinition
    ? TAttribute['options'][number]
    : TAttribute extends MultiSelectAttributeDefinition
    ? TAttribute['options'][number][]
    : TAttribute extends NumberAttributeDefinition
    ? number
    : TAttribute extends TextAttributeDefinition
    ? string
    : never

export type AttributeState<
  TAttributeDefinitions extends UnknownAttributeDefinitions
> = {
  [Key in keyof TAttributeDefinitions]: AttributeValue<
    TAttributeDefinitions[Key]
  >
}

export type AttributeGroupDefinitions<
  TAttributeDefinitions extends UnknownAttributeDefinitions
> = Record<
  string,
  | ReadonlyArray<keyof TAttributeDefinitions>
  | Record<string, (keyof TAttributeDefinitions)[]>
>

export type FlatAttributeGroupDefinitions<
  TAttributeDefinitions extends UnknownAttributeDefinitions,
  TAttributeGroupDefinitions extends AttributeGroupDefinitions<TAttributeDefinitions>
> = {
  [TKey in keyof TAttributeGroupDefinitions]: TAttributeGroupDefinitions[TKey] extends (keyof TAttributeDefinitions)[]
    ? TAttributeGroupDefinitions[TKey]
    : TAttributeGroupDefinitions[TKey] extends Record<
        string,
        infer TAttributeKeys extends (keyof TAttributeDefinitions)[]
      >
    ? TAttributeKeys
    : never
}

export function mapToAttributeDefinitions<
  TKeys extends ReadonlyArray<string>,
  TAttributeDefinition extends UnknownAttributeDefinition
>(keys: TKeys, definition: TAttributeDefinition) {
  return keys.reduce<Record<TKeys[number], TAttributeDefinition>>(
    (defs, key) => {
      defs[key as TKeys[number]] = definition
      return defs
    },
    {} as Record<TKeys[number], TAttributeDefinition>
  )
}
