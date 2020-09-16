declare type UUID = string

export interface Entity {
  tags: string[]
  info: string
  id: UUID
  name: string
}

export interface Being extends Entity {
  traits: Trait[]
}

export interface Trait extends Entity {
  fragments: TraitFragment[]
}

export enum TraitFragmentTypes {
  Text,
  Number,
  Selection,
}

export interface TraitFragment extends Entity {
  type: TraitFragmentTypes
}

export interface TraitFragmentText extends TraitFragment {
  value: string
}
