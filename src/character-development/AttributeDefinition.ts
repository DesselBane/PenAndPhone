import { DeepReadonly } from '../util/UtilityTypes'

export type INumberAttributeDefinition = DeepReadonly<{
  id: string
  type: 'number'
}>

export type ITextAttributeDefinition = DeepReadonly<{
  id: string
  type: 'text'
}>

export type ISingleSelectAttributeDefinition = DeepReadonly<{
  id: string
  type: 'single-select'
  options: DeepReadonly<string[]>
}>

export type TUnknownAttributeDefinition =
  | INumberAttributeDefinition
  | ITextAttributeDefinition
  | ISingleSelectAttributeDefinition

export type TUnknownAttributeDefinitions = DeepReadonly<
  TUnknownAttributeDefinition[]
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
  [Definition in TAttributeDefinitions[number] as Definition['id']]: TAttributeValue<Definition>
}

export type IAttributeGroupDefinitions<
  TAttributeDefinitions extends TUnknownAttributeDefinitions
> = DeepReadonly<Record<string, TAttributeDefinitions[number]['id'][]>>

export const attributes: TUnknownAttributeDefinitions = [
  { id: 'name', type: 'text' },
  { id: 'intelligence', type: 'number' },
  { id: 'stamina', type: 'number' },
  {
    id: 'race',
    type: 'single-select',
    options: ['human', 'warg'],
  },
] as const
