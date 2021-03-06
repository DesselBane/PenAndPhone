import { computed, ComputedRef, Ref, ref, SetupContext, UnwrapRef } from 'vue'

export const inputProps = {
  modelValue: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
}

export function useInput({ emit, attrs }: SetupContext): {
  updateValue: (value: string) => void
  inputEl: Ref<UnwrapRef<HTMLElement | null>>
  inputAttrs: ComputedRef<Record<string, unknown>>
  focus: () => void
} {
  const inputEl = ref<HTMLElement | null>(null)

  function updateValue(value: string) {
    emit('update:modelValue', value)
  }

  const inputAttrs = computed(() => {
    const attributes = { ...attrs, ref: 'inputEl' } as Record<string, unknown>
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
