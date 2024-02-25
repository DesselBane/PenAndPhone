import { defineCharacter } from '@pen-and-phone/core'

const charDefinition = defineCharacter()
  .addAttributes(
    {
      Erfahrung: {
        type: 'number',
      },
      Heldengrad: {
        type: 'custom',
        dataType: 'number',
      },
      Rasse: {
        type: 'single-select',
        options: ['Zwerg', 'Alb', 'Gnom', 'Varg'],
      },
      Haarfarbe: {
        type: 'text',
      },
      Sprachen: {
        type: 'multi-select',
        options: ['Venezial', 'Basargnomisch'],
      },
    },
    {
      tags: ['Generelles'],
    }
  )
  .addAttributes(
    {
      Größenklasse: {
        type: 'custom',
        dataType: 'number',
      },
      Geschwindigkeit: {
        type: 'custom',
        dataType: 'number',
      },
      Initiative: {
        type: 'custom',
        dataType: 'number',
      },
      Lebenspunkte: {
        type: 'custom',
        dataType: 'number',
      },
      Fokus: {
        type: 'custom',
        dataType: 'number',
      },
      Verteidigung: {
        type: 'custom',
        dataType: 'number',
        tags: ['Wiederstand'],
      },
      GeistigerWiederstand: {
        type: 'custom',
        dataType: 'number',
        tags: ['Wiederstand'],
      },
      KörperlicherWiederstand: {
        type: 'custom',
        dataType: 'number',
        tags: ['Wiederstand'],
      },
    },
    { tags: ['Abgeleitete Werte'] }
  )
  .addAttributes(
    {
      Ausstrahlung: {
        type: 'number',
      },
      Beweglichkeit: {
        type: 'number',
      },
      Intuition: {
        type: 'number',
      },
      Konstitution: {
        type: 'number',
      },
      Mystik: {
        type: 'number',
      },
      Stärke: {
        type: 'number',
      },
      Verstand: {
        type: 'number',
      },
      Willenskraft: {
        type: 'number',
      },
    },
    {
      tags: ['Attribut'],
    }
  )
  .addAttributes(
    {
      Akrobatik: {
        type: 'number',
        sources: ['Beweglichkeit', 'Stärke'],
      },
      Alchemie: {
        type: 'number',
        sources: ['Mystik', 'Verstand'],
      },
      Anführen: {
        type: 'number',
        sources: ['Ausstrahlung', 'Willenskraft'],
      },
      'Arkane Kunde': {
        type: 'number',
        sources: ['Mystik', 'Verstand'],
      },
      Athlethik: {
        type: 'number',
        sources: ['Beweglichkeit', 'Stärke'],
      },
      Darbietung: {
        type: 'number',
        sources: ['Ausstrahlung', 'Willenskraft'],
      },
      Diplomatie: {
        type: 'number',
        sources: ['Ausstrahlung', 'Willenskraft'],
      },
      Edelhandwerk: {
        type: 'number',
        sources: ['Intuition', 'Verstand'],
      },
      Entschlossenheit: {
        type: 'number',
        sources: ['Ausstrahlung', 'Willenskraft'],
      },
      Fingerfertigkeit: {
        type: 'number',
        sources: ['Ausstrahlung', 'Beweglichkeit'],
      },
      'Geschichten und Mythen': {
        type: 'number',
        sources: ['Mystik', 'Verstand'],
      },
      Handwerk: {
        type: 'number',
        sources: ['Konstitution', 'Verstand'],
      },
      Heilkunde: {
        type: 'number',
        sources: ['Intuition', 'Verstand'],
      },
      Heimlichkeit: {
        type: 'number',
        sources: ['Beweglichkeit', 'Intuition'],
      },
      Jagdkunst: {
        type: 'number',
        sources: ['Konstitution', 'Verstand'],
      },
      Länderkunde: {
        type: 'number',
        sources: ['Intuition', 'Verstand'],
      },
      Naturkunde: {
        type: 'number',
        sources: ['Intuition', 'Verstand'],
      },
      Redegewandheit: {
        type: 'number',
        sources: ['Ausstrahlung', 'Willenskraft'],
      },
      'Schlösser und Fallen': {
        type: 'number',
        sources: ['Intuition', 'Beweglichkeit'],
      },
      Schwimmen: {
        type: 'number',
        sources: ['Stärke', 'Konstitution'],
      },
      Seefahrt: {
        type: 'number',
        sources: ['Beweglichkeit', 'Konstitution'],
      },
      Straßenkunde: {
        type: 'number',
        sources: ['Ausstrahlung', 'Intuition'],
      },
      Tierführung: {
        type: 'number',
        sources: ['Ausstrahlung', 'Beweglichkeit'],
      },
      Überleben: {
        type: 'number',
        sources: ['Intuition', 'Konstitution'],
      },
      Wahrnehmung: {
        type: 'number',
        sources: ['Intuition', 'Willenskraft'],
      },
      Zähigkeit: {
        type: 'number',
        sources: ['Konstitution', 'Willenskraft'],
      },
    },
    {
      tags: ['Fertigkeiten'],
    }
  )
  .addAttributes(
    {
      Bann: {
        type: 'number',
        sources: ['Mystik', 'Willenskraft'],
      },
      Beherrschung: {
        type: 'number',
        sources: ['Mystik', 'Willenskraft'],
      },
      Bewegung: {
        type: 'number',
        sources: ['Mystik', 'Beweglichkeit'],
      },
      Erkenntnis: {
        type: 'number',
        sources: ['Mystik', 'Verstand'],
      },
      Fels: {
        type: 'number',
        sources: ['Mystik', 'Konstitution'],
      },
      Feuer: {
        type: 'number',
        sources: ['Mystik', 'Ausstrahlung'],
      },
      Heilung: {
        type: 'number',
        sources: ['Mystik', 'Ausstrahlung'],
      },
      Illusion: {
        type: 'number',
        sources: ['Mystik', 'Ausstrahlung'],
      },
      Kamp: {
        type: 'number',
        sources: ['Mystik', 'Stärke'],
      },
      Licht: {
        type: 'number',
        sources: ['Mystik', 'Ausstrahlung'],
      },
      Natur: {
        type: 'number',
        sources: ['Mystik', 'Ausstrahlung'],
      },
      Schatten: {
        type: 'number',
        sources: ['Mystik', 'Intuition'],
      },
      Schicksal: {
        type: 'number',
        sources: ['Mystik', 'Ausstrahlung'],
      },
      Schutz: {
        type: 'number',
        sources: ['Mystik', 'Ausstrahlung'],
      },
      Stärkung: {
        type: 'number',
        sources: ['Mystik', 'Stärke'],
      },
      Tod: {
        type: 'number',
        sources: ['Mystik', 'Verstand'],
      },
      Verwandlung: {
        type: 'number',
        sources: ['Mystik', 'Konstitution'],
      },
      Wasser: {
        type: 'number',
        sources: ['Mystik', 'Intuition'],
      },
      Wind: {
        type: 'number',
        sources: ['Mystik', 'Verstand'],
      },
    },
    {
      tags: ['Magieschulen'],
    }
  )
  .addAttributes(
    {
      Handgemenge: {
        type: 'number',
      },
      Hiebwaffen: {
        type: 'number',
      },
      Kettenwaffen: {
        type: 'number',
      },
      Klingenwaffen: {
        type: 'number',
      },
      Stangenwaffen: {
        type: 'number',
      },
      Schusswaffen: {
        type: 'number',
      },
      Wurfwaffen: {
        type: 'number',
      },
    },
    {
      tags: ['Kampffertigkeiten'],
    }
  )
