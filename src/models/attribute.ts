import { CompositionSource } from '@models/composable'
import { Incrementable, IncrementableBase } from '@models/increment'
import { computed, reactive, nextTick } from 'vue'
import { jsonObject } from 'typedjson'
import { ReferenceableBase } from './reference'

@jsonObject(ReferenceableBase.options)
export class Attribute extends IncrementableBase
  implements Incrementable, CompositionSource {
  public currentValue = 0

  constructor(label = '') {
    super(label)

    const that = reactive(this) as Attribute

    nextTick(() => {
      that.currentValue = (computed(() =>
        that.increments.reduce(
          (previousValue, { amount }) => previousValue + amount,
          0
        )
      ) as unknown) as number
    })

    return that
  }
}
