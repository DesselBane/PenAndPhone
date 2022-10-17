export interface INumberAttributeDefinition {
  id: string
  type: 'number'
}

export interface ITextAttributeDefinition {
  id: string
  type: 'text'
}

export interface IValueOption {
  id: string
  value: string
}

export interface ISingleSelectAttributeDefinition {
  id: string
  type: 'single-select'
  options: ReadonlyArray<IValueOption>
}

export type TUnknownAttributeDefinition =
  | INumberAttributeDefinition
  | ITextAttributeDefinition
  | ISingleSelectAttributeDefinition

export const attributes: ReadonlyArray<TUnknownAttributeDefinition> = [
  { id: 'name', type: 'text' },
  { id: 'intelligence', type: 'number' },
  { id: 'stamina', type: 'number' },
  {
    id: 'race',
    type: 'single-select',
    options: [
      { id: 'human', value: 'Human' },
      { id: 'warg', value: 'Warg' },
    ],
  },
] as const
