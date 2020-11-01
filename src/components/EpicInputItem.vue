<template>
  <label class="epic-input-label">
    {{ label }}
    <slot />
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { inputProps } from './shared/input'

export default defineComponent({
  name: 'EpicInputItem',
  props: {
    label: inputProps.label,
  },
})
</script>

<style lang="scss" scoped>
@import 'src/styles/shared.scss';

.epic-input-label {
  display: grid;
  gap: 0.5rem;
  font-weight: 600;
  color: rgba($color-text, 0.65);
  text-align: left;
  letter-spacing: 0.05em;
}
</style>
