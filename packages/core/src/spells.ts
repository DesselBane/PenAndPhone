import { FokusKosten, HeldenGrad, Reichweite, Zeiteinheit } from './units'

export type ErfolgsgradDefinition =
  | 'Auslösezeit'
  | 'Kanalisierter Fokus'
  | 'Verzehrter Fokus'
  | 'Erschöpfter Fokus'
  | [
      typ: 'Verstärken',
      benötigkteErfolgsgrade: number,
      kosten: FokusKosten,
      effekt: string
    ]

export type ZauberDefinition<
  TAvailableMagieschulenDefinitionIds extends string
> = {
  readonly name: string
  schule: readonly [
    schule: TAvailableMagieschulenDefinitionIds,
    grad: HeldenGrad
  ][]
  schwierigkeit: number
  fokusKosten: FokusKosten
  zauberDauer: Zeiteinheit
  reichweite: Reichweite
  wirkdauer: 'Sofort' | 'Kanalisiert' | Zeiteinheit
  readonly wirkung: string
  erfolgsgrade: readonly ErfolgsgradDefinition[]
}

export type Effekt<TAttributId extends string> = {
  targetAttribut: TAttributId
  operation: 'add' | 'subtract' | 'set'
}

const foo: ZauberDefinition<'Natur'> = {
  name: 'Tierischer Riesenwuchs',
  schule: [['Natur', 3]],
  schwierigkeit: 21,
  fokusKosten: [0, 8, 2],
  zauberDauer: [7, 'ticks'],
  reichweite: 'Behrührung',
  wirkdauer: 'Kanalisiert',
  wirkung:
    'Ein Wesen des Typus Tier wächst zu einer größeren Form seiner selbst an. GK, GSW, LP, KW und SR steigen um 2 Punkte.',
  erfolgsgrade: [
    'Auslösezeit',
    'Kanalisierter Fokus',
    'Verzehrter Fokus',
    [
      'Verstärken',
      1,
      [0, 2, 2],
      'Der Schaden des Wesens steigt um 1 Punkt, sofern die WGS bei maximal 9 liegt, oder um 2 Punkte, wenn die WGS größer als 9 ist.',
    ],
  ],
}
