<template>
  <div class="container">
    <label class="epic-input-label" :for="inputId">
      {{ label }}
    </label>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { inputProps } from './shared/input'

export default defineComponent({
  name: 'EpicInputItem',
  props: {
    label: inputProps.label,
    inputId: {
      type: String,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
@import 'src/styles/shared.scss';

.container {
  display: grid;
  gap: 0.5rem;
}

.epic-input-label {
  font-weight: 600;
  color: rgba($color-text, 0.65);
  text-align: left;
  letter-spacing: 0.05em;
}
</style>
