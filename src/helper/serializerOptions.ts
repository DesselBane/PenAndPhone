import { reactive, Ref, ref, unref, UnwrapRef } from '@vue/reactivity'
import { TypedJSON } from 'typedjson'
import { IJsonArrayMemberOptions } from 'typedjson/js/typedjson/json-array-member'
import { IJsonMemberOptions } from 'typedjson/js/typedjson/json-member'
import { Serializable } from 'typedjson/js/typedjson/types'

export function serializableRefOptions<T>(
  type: Serializable<T>
): IJsonMemberOptions {
  return {
    deserializer: (json: any): Ref<UnwrapRef<T> | undefined> => {
      return ref(TypedJSON.parse(json, type))
    },
    serializer: (value: Ref<T>) => {
      return TypedJSON.toPlainJson(unref(value), type)
    },
  }
}

export function serializableReactiveArrayOptions(): IJsonArrayMemberOptions {
  return {
    deserializer: (json) => {
      return reactive(json)
    },
  }
}

export function serializableRefArrayOptions(): IJsonArrayMemberOptions {
  return {
    serializer: (value) => {
      return unref(value)
    },
    deserializer: (json) => {
      return ref(json)
    },
  }
}
