import { Entry, LedgerEntryKindMap } from './Entry'

export * from './Entry'

export const filterByKind =
  <TKindId extends keyof LedgerEntryKindMap>(kindId: TKindId) =>
  (entry: Entry): entry is LedgerEntryKindMap[TKindId] =>
    entry.kind === kindId

export class Ledger {
  protected entries: Entry[] = []

  protected entriesByType<TKindId extends keyof LedgerEntryKindMap>(
    kindId: TKindId
  ): LedgerEntryKindMap[TKindId][] {
    return this.entries.filter(filterByKind(kindId))
  }

  protected appendEntry(entry: Entry) {
    this.entries.push(entry)
  }
}
