export type INumberAttributeDefinition = {
  type: 'number'
}

export type ITextAttributeDefinition = {
  type: 'text'
}

export type ISingleSelectAttributeDefinition = {
  type: 'single-select'
  options: ReadonlyArray<string | number>
}

export type TUnknownAttributeDefinition =
  | INumberAttributeDefinition
  | ITextAttributeDefinition
  | ISingleSelectAttributeDefinition

export type TUnknownAttributeDefinitions = Record<
  string,
  TUnknownAttributeDefinition
>

export type TAttributeValue<TAttribute extends TUnknownAttributeDefinition> =
  TAttribute extends ISingleSelectAttributeDefinition
    ? TAttribute['options'][number]
    : TAttribute extends INumberAttributeDefinition
    ? number
    : string

export type TAttributeState<
  TAttributeDefinitions extends TUnknownAttributeDefinitions
> = {
  [Key in keyof TAttributeDefinitions]: TAttributeValue<
    TAttributeDefinitions[Key]
  >
}

export type IAttributeGroupDefinitions<
  TAttributeDefinitions extends TUnknownAttributeDefinitions
> = Record<string, (keyof TAttributeDefinitions)[]>
