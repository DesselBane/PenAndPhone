<template>
  <EpicInputItem :label="label">
    <div class="epic-attribute-input-controls">
      <input
        v-bind="inputAttrs"
        class="epic-attribute-input"
        :value="modelValue"
        readonly
      />
      <EpicButton
        icon="arrow-down"
        icononly
        @click="updateValue(modelValue - 1)"
      />
      <EpicButton
        icon="arrow-up"
        icononly
        @click="updateValue(modelValue + 1)"
      />
    </div>
  </EpicInputItem>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { inputProps, useInput } from './shared/input'
import EpicButton from '@components/EpicButton'
import EpicInputItem from '@components/EpicInputItem'

export default defineComponent({
  name: 'EpicAttributeInput',
  components: {
    EpicButton,
    EpicInputItem,
  },
  props: inputProps,
  setup(_, ctx) {
    const { inputEl, inputAttrs, updateValue, focus } = useInput(ctx)

    return {
      inputEl,
      inputAttrs,
      updateValue,
      focus,
    }
  },
})
</script>

<style lang="scss" scoped>
@import './shared/input.scss';

.epic-attribute-input-controls {
  display: grid;
  grid-template-columns: 1fr 3rem 3rem;
  gap: 0.5rem;
}

.epic-attribute-input {
  @include input;
}
</style>
