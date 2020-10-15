const TABBABLE_SELECTOR =
  'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable], audio[controls], video[controls], summary, [tabindex^="0"], [tabindex^="1"], [tabindex^="2"], [tabindex^="3"], [tabindex^="4"], [tabindex^="5"], [tabindex^="6"], [tabindex^="7"], [tabindex^="8"], [tabindex^="9"]'

export function isTabbable(element: HTMLElement): boolean {
  return element.matches(TABBABLE_SELECTOR)
}

export function getTabbableElements(element: HTMLElement): HTMLElement[] {
  const tabbableElements = Array.from(
    element.querySelectorAll(TABBABLE_SELECTOR) as NodeListOf<HTMLElement>
  )
  if (isTabbable(element)) {
    tabbableElements.unshift(element)
  }
  return tabbableElements
}
