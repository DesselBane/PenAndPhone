export const magieSchulen = [
  'bann',
  'beherrschung',
  'bewegung',
  'erkenntnis',
  'fels',
  'feuer',
  'heilung',
  'illusion',
  'kampf',
  'licht',
  'natur',
  'schatten',
  'schicksal',
  'schutz',
  'staerkung',
  'tod',
  'verwandlung',
  'wasser',
  'wind',
] as const
export type Magieschule = typeof magieSchulen[number]
