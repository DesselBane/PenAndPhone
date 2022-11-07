export type NumberAttributeDefinition = {
  type: 'number'
}

export type TextAttributeDefinition = {
  type: 'text'
}

export type SingleSelectAttributeDefinition = {
  type: 'single-select'
  options: ReadonlyArray<string | number>
}

export type MultiSelectAttributeDefinition = {
  type: 'multi-select'
  options: ReadonlyArray<string | number>
}

export type UnknownAttributeDefinition =
  | NumberAttributeDefinition
  | TextAttributeDefinition
  | SingleSelectAttributeDefinition
  | MultiSelectAttributeDefinition

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
    : string

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
  | (keyof TAttributeDefinitions)[]
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

export type AttributeDefinitions<
  TAttributes extends UnknownAttributeDefinitions,
  TAttributeGroups extends AttributeGroupDefinitions<TAttributes>
> = {
  attributes: TAttributes
  groups: TAttributeGroups
}

export const defineAttributes = <
  TAttributes extends UnknownAttributeDefinitions,
  TAttributeGroups extends AttributeGroupDefinitions<TAttributes>
>(
  attributes: TAttributes,
  groups: TAttributeGroups
): AttributeDefinitions<TAttributes, TAttributeGroups> => ({
  attributes,
  groups,
})
