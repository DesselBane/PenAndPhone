import { reactive } from '@vue/reactivity'

export class ReactiveBase {
  constructor() {
    return reactive(this)
  }
}
