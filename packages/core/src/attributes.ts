import { TagContainer } from './tags'

export type UAvailableAttributeConfig = AvailableAttributConfig<any>
export type AvailableAttributConfig<TAvailableAttributeIds extends string> = {
  availableAttributeIds: TAvailableAttributeIds
}

export type NumberAttributeDefinition<
  TConfig extends UAvailableAttributeConfig,
> = TagContainer & {
  type: 'number'
  sources?: TConfig['availableAttributeIds'][]
}

export type NumberComputedSource<TConfig extends UAvailableAttributeConfig> = {
  id: TConfig['availableAttributeIds']
  operation: 'add' | 'subtract'
}

export type TextAttributeDefinition = TagContainer & {
  type: 'text'
}

export type SingleSelectAttributeDefinition = TagContainer & {
  type: 'single-select'
  options: ReadonlyArray<string>
}

export type MultiSelectAttributeDefinition = TagContainer & {
  type: 'multi-select'
  options: ReadonlyArray<string>
}

export type CustomAttributeDefinition = TagContainer & {
  type: 'custom'
  readonly id?: string
  dataType: 'number' | 'string'
}

type SimpleAttributeDataTypeMap = {
  number: number
  text: string
  'single-select': string
  'multi-select': string[]
  custom: never
}

export type AttributeDataTypeFromDefintion<
  TDefinition extends UnknownAttributeDefinition<any>,
> = TDefinition extends { type: 'custom' }
  ? TDefinition['dataType'] extends 'number'
    ? number
    : string
  : SimpleAttributeDataTypeMap[TDefinition['type']]

export type AttributeStateFromDefinitions<
  TAttributeDefinitions extends AttributeDefinitions<any>,
> = {
  [prop in keyof TAttributeDefinitions]: AttributeDataTypeFromDefintion<
    TAttributeDefinitions[prop]
  >
}

export type UnknownAttributeDefinition<
  TConfig extends UAvailableAttributeConfig,
> =
  | TextAttributeDefinition
  | NumberAttributeDefinition<TConfig>
  | SingleSelectAttributeDefinition
  | MultiSelectAttributeDefinition
  | CustomAttributeDefinition

export type AttributeDefinitions<TConfig extends UAvailableAttributeConfig> =
  Record<string, UnknownAttributeDefinition<TConfig>>

export type AttributeConfigFromDefinition<
  TAttrbiteDefinition extends AttributeDefinitions<any>,
> = {
  availableAttributeIds: keyof TAttrbiteDefinition & string
}
