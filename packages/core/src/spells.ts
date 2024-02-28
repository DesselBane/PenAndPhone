import { FokusKosten, HeldenGrad, Reichweite, Zeiteinheit } from './units'

export type ErfolgsgradDefinition<TAvailableAttributIds extends string> =
  | 'Auslösezeit'
  | 'Kanalisierter Fokus'
  | 'Verzehrter Fokus'
  | 'Erschöpfter Fokus'
  | [
      typ: 'Verstärken',
      benötigkteErfolgsgrade: number,
      kosten: FokusKosten,
      effekt: [string, readonly Effekt<TAvailableAttributIds>[]]
    ]

export type ZauberDefinition<
  TAvailableAttributIds extends string,
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
  readonly wirkung: [string, readonly Effekt<TAvailableAttributIds>[]]
  erfolgsgrade: readonly ErfolgsgradDefinition<TAvailableAttributIds>[]
}

export type Effekt<TAttributId extends string> =
  | SimpleEffekt<TAttributId>
  | ComplexEffekt<TAttributId>

export type SimpleEffekt<TAttributId extends string> = {
  targetAttribut: TAttributId
  operation: 'add' | 'subtract' | 'set'
  value: number
}

export type ComplexEffekt<TAttributId extends string> = {
  (charData: Record<TAttributId, number>): readonly SimpleEffekt<TAttributId>[]
}

const foo: ZauberDefinition<
  'GK' | 'GSW' | 'LP' | 'KW' | 'SR' | 'WGS' | 'Schaden',
  'Natur'
> = {
  name: 'Tierischer Riesenwuchs',
  schule: [['Natur', 3]],
  schwierigkeit: 21,
  fokusKosten: [0, 8, 2],
  zauberDauer: [7, 'ticks'],
  reichweite: 'Behrührung',
  wirkdauer: 'Kanalisiert',
  wirkung: [
    'Ein Wesen des Typus Tier wächst zu einer größeren Form seiner selbst an. GK, GSW, LP, KW und SR steigen um 2 Punkte.',
    [
      {
        targetAttribut: 'GK',
        operation: 'add',
        value: 2,
      },
    ],
  ],
  erfolgsgrade: [
    'Auslösezeit',
    'Kanalisierter Fokus',
    'Verzehrter Fokus',
    [
      'Verstärken',
      1,
      [0, 2, 2],
      [
        'Der Schaden des Wesens steigt um 1 Punkt, sofern die WGS bei maximal 9 liegt, oder um 2 Punkte, wenn die WGS größer als 9 ist.',
        [
          (charData) => {
            if (charData['WGS'] <= 9) {
              return [
                {
                  targetAttribut: 'Schaden',
                  operation: 'add',
                  value: 1,
                },
              ]
            } else {
              return [
                {
                  targetAttribut: 'Schaden',
                  operation: 'add',
                  value: 2,
                },
              ]
            }
          },
        ],
      ],
    ],
  ],
}
