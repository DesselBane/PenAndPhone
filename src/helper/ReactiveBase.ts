/* eslint-disable */
import { computed, reactive } from '@vue/reactivity'

export class ReactiveBase {
  constructor() {
    return reactive(this)
  }
}

export function computedProp(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): void {
  const propName = `__${String(propertyKey)}`
  const newDescriptor: PropertyDescriptor = {
    get(this: any) {
      if (!this[propName]) {
        if (descriptor.get === undefined) {
          throw 'Need a getter'
        }

        this[propName] = computed(descriptor.get)
      }

      return this[propName]
    },
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
  }

  Object.defineProperty(target, propName, newDescriptor)
}
