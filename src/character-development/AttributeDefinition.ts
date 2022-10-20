export interface INumberAttributeDefinition {
  id: string
  type: 'number'
}

export interface ITextAttributeDefinition {
  id: string
  type: 'text'
}

export interface ISingleSelectAttributeDefinition {
  id: string
  type: 'single-select'
  options: ReadonlyArray<string>
}

export type TUnknownAttributeDefinition =
  | INumberAttributeDefinition
  | ITextAttributeDefinition
  | ISingleSelectAttributeDefinition

export type TUnknownAttributeDefinitions =
  ReadonlyArray<TUnknownAttributeDefinition>

export type TAttributeState<
  TAttributeDefinitions extends TUnknownAttributeDefinitions
> = {
  [Definition in TAttributeDefinitions[number] as Definition['id']]: Definition extends ISingleSelectAttributeDefinition
    ? Definition['options'][number]
    : Definition extends INumberAttributeDefinition
    ? number
    : string
}

export const attributes: ReadonlyArray<TUnknownAttributeDefinition> = [
  { id: 'name', type: 'text' },
  { id: 'intelligence', type: 'number' },
  { id: 'stamina', type: 'number' },
  {
    id: 'race',
    type: 'single-select',
    options: ['human', 'warg'],
  },
] as const
