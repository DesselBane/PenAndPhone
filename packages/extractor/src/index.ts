import { readFileSync } from 'fs'
import { resolve } from 'path'
import {
  FokusKosten,
  HeldenGrad,
  Reichweite,
  Typus,
  Zauberschule,
  ZauberSchwierigkeit,
  Zauberverstärkung,
  Zeitlänge,
} from './units.js'

type Zauber = {
  title: string
  schulen: [Zauberschule, HeldenGrad][]
  typus: Typus
  schwierigkeit: ZauberSchwierigkeit
  kosten: FokusKosten
  reichweite: Reichweite
  zauberdauer: Zeitlänge
  wirkung: string
  wirkungsdauer: Zeitlänge
  wirkungsbereich?: Reichweite
  erfolgsgrade: Zauberverstärkung[]
}

function parseZauber(filePath: string) {
  const data = readFileSync(filePath).toString()
  const rows = data.split('\r\n')

  const schulen = new Set<string>()
  const typus = new Set<string>()

  for (const row of rows) {
    if (row.includes('Schulen')) {
      const schulenLocal = `${row}`.replace('Schulen: ', '').split(',')

      for (const schule of schulenLocal) {
        schulen.add(schule.trim().split(' ')[0])
      }
    }
    if (row.includes('Typus: ')) {
      ;`${row}`
        .replace('Typus: ', '')
        .split(',')
        .forEach((x) => typus.add(x.trim()))
    }
  }

  console.log(rows.slice(0, 22))
  console.log(typus)
}

parseZauber(
  resolve(import.meta.dirname, '..', '..', '..', 'data', 'Zauber.txt')
)
