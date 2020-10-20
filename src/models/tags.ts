import { jsonArrayMember } from 'typedjson'

export interface Taggable {
  tags: string[]
}

export abstract class TaggableBase implements Taggable {
  @jsonArrayMember(String)
  public tags: string[] = []
}

export enum DefaultTags {
  generelles = 'Generelles',
  attribute = 'Attribute',
  ep = 'Erfahrungspunkte',
  abgeleiteteWerte = 'Abgeleitete Werte',
  fertigkeiten = 'Fertigkeiten',
  magieschulen = 'Magieschulen',
  zauber = 'Zauber',
  kampfFertigkeiten = 'Kampffertigkeiten',
  ruestungen = 'Rüstungen',
  waffen = 'Waffen',
  staerken = 'Stärken',
  ausruestung = 'Ausrüstung',
  vermoegen = 'Vermögen',
  meisterschaften = 'Meisterschaften',
}
