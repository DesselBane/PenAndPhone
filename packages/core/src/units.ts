export type Zeiteinheit = [
  menge: number,
  einheit: 'ticks' | 'sekunden' | 'minuten' | 'stunden'
]

export type FokusKosten = [
  erschöpft: number,
  kanalisiert: number,
  verzehrt: number
]

export type Reichweite =
  | 'Zauberer'
  | 'Behrührung'
  | [menge: number, einheit: 'meter']

export type HeldenGrad = 0 | 1 | 2 | 3 | 4
