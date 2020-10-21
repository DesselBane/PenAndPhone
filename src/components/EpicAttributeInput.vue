<template>
  <label class="epic-attribute-input-wrapper">
    {{ label }}
    <div class="epic-attribute-input-controls">
      <input
        ref="inputEl"
        class="epic-attribute-input"
        :value="modelValue"
        @input="updateValue($event.target.value)"
        readonly
      />
      <EpicButton icon="arrow-down" icononly />
      <EpicButton icon="arrow-up" icononly />
    </div>
  </label>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import EpicButton from '@components/EpicButton'

export default defineComponent({
  name: 'EpicAttributeInput',
  components: {
    EpicButton,
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
  },
  setup(_, { emit }) {
    const inputEl: Ref<HTMLElement | null> = ref(null)

    function updateValue(value: string) {
      emit('update:modelValue', value)
    }

    function focus() {
      if (inputEl.value != null) {
        inputEl.value.focus()
      }
    }

    return {
      inputEl,
      updateValue,
      focus,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/styles/shared.scss';

.epic-attribute-input-wrapper {
  display: grid;
  gap: 0.5rem;
  font-weight: 600;
  color: rgba($color-text, 0.65);
  text-align: left;
  letter-spacing: 0.05em;
}

.epic-attribute-input-controls {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.5rem;
}

$input-base-shadow: 0 0 2px shadow(0.3), 0 4px 12px -4px shadow(0.2),
  inset 0 0 0 1px shadow(0.3), inset 0 0 0 2px light(0.9),
  inset 0 0 5px 1px shadow(0.15);

.epic-attribute-input {
  all: initial;
  padding: 0.7rem 1.2rem;
  font-size: 1.1rem;
  color: $color-text;
  letter-spacing: 0.05em;
  border-radius: 0.1rem;
  box-shadow: $input-base-shadow;
  transition: box-shadow 0.05s ease-out;

  @include bg-paper($color-body);

  &:focus {
    box-shadow: $input-base-shadow, 0 10px 26px -10px rgba($color-primary, 0.5),
      0 0 5px rgba($color-primary, 0.3);
  }

  &::placeholder {
    color: rgba($color-text, 0.35);
  }
}
</style>
