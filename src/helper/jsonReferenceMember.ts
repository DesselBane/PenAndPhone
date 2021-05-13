import { Referenceable } from '@models/Reference'
import { storeInstance } from '@store/data-store'
import { jsonMember } from 'typedjson'

export function jsonReferenceMember<T extends Referenceable>(
  // eslint-disable-next-line
  target: any,
  propertyKey: string
): void {
  const idPropKey = `__${propertyKey}`
  Object.defineProperty(target, idPropKey, {
    writable: true,
    configurable: false,
  })
  Object.defineProperty(target, propertyKey, {
    get(): T | undefined {
      const dataId = this[idPropKey]

      // This is required, otherwise there is a circular dependency during instantiation
      // This is bc jsonMember will try to get the initial value of the property
      // at this time the store instance is not initialized since all decorators
      // run before any code gets instantiated
      if (dataId == null) {
        return undefined
      }

      const data = storeInstance.getReference(this[idPropKey])
      return data == null ? undefined : (data as T)
    },
    set(value: T | undefined) {
      this[idPropKey] = value?.id
    },
  })

  jsonMember(String)(target, idPropKey)
}
