import { MergeDeep } from 'type-fest'

export type TagContainer = {
  tags?: readonly string[]
}

export type MergedWithTags<
  TOriginalType extends Record<string, unknown>,
  TTagsContainer extends TagContainer,
> = {
  [Prop in keyof TOriginalType]: MergeDeep<
    TTagsContainer,
    TOriginalType[Prop],
    {
      arrayMergeMode: 'spread'
    }
  >
}
