import { merge } from 'lodash-es'
import type { MergeDeep, ConditionalKeys } from 'type-fest'
import { MergedWithTags, TagContainer } from './tags'

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

export function defineCharacter() {
  return new CharacterDefinition({})
}

export class CharacterDefinition<
  TAttributeDefinition extends AttributeDefinition<any>
> {
  attributes: TAttributeDefinition

  constructor(attributeDefinition: TAttributeDefinition) {
    this.attributes = attributeDefinition
  }

  withFilter<
    const TFilter extends Partial<UnknownAttributeDefinition<any>>,
    const TNewAttributDefinition extends AttributeDefinition<any>
  >(
    _filter: TFilter,
    callback: (
      filteredeCharDef: CharacterDefinition<
        Pick<
          TAttributeDefinition,
          ConditionalKeys<TAttributeDefinition, TFilter>
        >
      >
    ) => CharacterDefinition<TNewAttributDefinition>
  ): CharacterDefinition<TNewAttributDefinition> {
    return callback(this)
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
