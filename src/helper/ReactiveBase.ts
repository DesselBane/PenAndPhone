import { computed, reactive } from '@vue/reactivity'

export class ReactiveBase {
  constructor() {
    return reactive(this)
  }
}

export function computedProp(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const newDescriptor: PropertyDescriptor = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(this: any) {
      const propName = `__${String(propertyKey)}`

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

  Object.defineProperty(target, name, newDescriptor)
}
