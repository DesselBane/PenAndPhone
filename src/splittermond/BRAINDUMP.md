# Braindump

## Computed vs. Watchables / Effects

Wenn wir Computed komplett ablösen, muss bei der Berechnung jedes Attributs die komplette Effecthistorie geprüft werden. Sehr wahrscheinlich führt das zu Performanceproblemen.

Eine Idee wäre zusätzlich zu `attributes` und `rawAttributes` noch `modifiedAttributes` zu speichern. Eine Mutation kann dann entweder die `rawAttributes` verändern, oder die `modifiedAttributes`. Für `attributes` werden am Ende die `modifiedAttributes` angewendet.

Um die Info über die Herkunft der Modifikation zu holen muss dann wiederum die Evenhistorie gefiltert werden, was vermutlich ausreichend ist, solange es nur auf Anfrage passiert.

## Zaubersprüche

Ein Zauberspruch kann ähnlich wie eine Meisterschaft gekauft werden. Er hat einige Attribute, die ihn näher bestimmen (fokus, gsw, typen):

```ts
const feuerball = {
  key: 'feuerball',
  magieschulen: ['kampfmagie', 'feuermagie'],
  gsw: 6,
  fokus: 4,
  fokusV: 2,
  fokusK: 0,
  typen: ['kampf', 'elementar'],
}
```

Eine Meisterschaft in der Magieschule kann einen Effekt auf die Attribute des Zauberspruchs haben.
Wie können wir diese Effekte speichern und anwenden?
