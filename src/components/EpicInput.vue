<template>
  <label class="epic-input-wrapper">
    {{ label }}
    <input
      class="epic-input"
      v-bind="$attrs"
      :value="modelValue"
      @input="updateValue($event.target.value)"
    />
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EpicInput',
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
  methods: {
    updateValue(value: string) {
      this.$emit('update:modelValue', value)
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@styles/shared.scss';

.epic-input-wrapper {
  display: grid;
  gap: 0.5rem;
  font-weight: 600;
  color: rgba($color-text, 0.65);
  text-align: left;
  letter-spacing: 0.05em;
}

$input-base-shadow: 0 0 2px shadow(0.3), 0 4px 12px -4px shadow(0.2),
  inset 0 0 0 1px shadow(0.3), inset 0 0 0 2px light(0.9),
  inset 0 0 5px 1px shadow(0.15);

.epic-input {
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
