import { merge } from 'lodash-es'
import type { MergeDeep } from 'type-fest'

export type TagContainer = {
  tags?: readonly string[]
}

export type NumberAttributeDefinition<TAvailableAttributeIds extends string> =
  TagContainer & {
    type: 'number'
    sources?: TAvailableAttributeIds[]
  }

export type NumberComputedSource<TAvailableAttributeIds extends string> = {
  id: TAvailableAttributeIds
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

export type UnknownAttributeDefinition<TAvailableAttributeIds extends string> =
  | TextAttributeDefinition
  | NumberAttributeDefinition<TAvailableAttributeIds>
  | SingleSelectAttributeDefinition
  | MultiSelectAttributeDefinition
  | CustomAttributeDefinition

export type AttributeDefinition<TAvailableAttributeIds extends string> = Record<
  string,
  UnknownAttributeDefinition<TAvailableAttributeIds>
>

export type MergedWithTags<
  TOriginalType extends Record<string, unknown>,
  TTagsContainer extends TagContainer
> = {
  [Prop in keyof TOriginalType]: MergeDeep<
    TTagsContainer,
    TOriginalType[Prop],
    {
      arrayMergeMode: 'spread'
    }
  >
}

export function defineCharacter() {
  return new CharacterDefinition({})
}

export class CharacterDefinition<
  TAttributeDefinition extends AttributeDefinition<never>
> {
  attributes: TAttributeDefinition

  constructor(attributeDefinition: TAttributeDefinition) {
    this.attributes = attributeDefinition
  }

  addAttributes<
    const TTagContainer extends TagContainer,
    const TNewAttributeDefinition extends AttributeDefinition<
      keyof TAttributeDefinition & string
    >
  >(
    definition: TNewAttributeDefinition,
    addToAll?: TTagContainer
  ): CharacterDefinition<
    TAttributeDefinition &
      MergedWithTags<TNewAttributeDefinition, TTagContainer>
  > {
    // TODO move this into a function and unit test it
    for (const key in definition) {
      definition[key] = merge({}, addToAll ?? {}, definition[key])
    }

    const mergedDefinition: MergedWithTags<
      TNewAttributeDefinition,
      TTagContainer
    > = definition as any

    return new CharacterDefinition({
      ...this.attributes,
      ...mergedDefinition,
    })
  }
}
