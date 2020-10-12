import { ref, Ref } from '@vue/reactivity'

export class Trait {
  public name: Ref<string> = ref('')
  public value: Ref<string> = ref('')
}
