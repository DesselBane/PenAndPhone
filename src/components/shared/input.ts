import { ref, computed, SetupContext } from 'vue'

export const inputProps = {
  modelValue: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
}

export function useInput({ emit, attrs }: SetupContext) {
  const inputEl = ref<HTMLElement | null>(null)

  function updateValue(value: string) {
    emit('update:modelValue', value)
  }

  const inputAttrs = computed(() => {
    const attributes = { ...attrs, ref: 'inputEl' }
    delete attributes.class
    delete attributes.style
    return attributes
  })

  function focus() {
    if (inputEl.value != null) {
      inputEl.value.focus()
    }
  }

  return {
    inputEl,
    inputAttrs,
    updateValue,
    focus,
  }
}
