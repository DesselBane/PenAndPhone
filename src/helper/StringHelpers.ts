export function isNullOrWhitespace(value: string | undefined | null): boolean {
  if (value == null) {
    return true
  }
  return value.trim() === ''
}
