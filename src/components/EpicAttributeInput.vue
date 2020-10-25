<template>
  <EpicInputItem :label="label">
    <div class="epic-attribute-input-controls">
      <EpicButton icon="arrow-down" icononly @click="() => emit('decrement')" />
      <input
        v-bind="inputAttrs"
        class="epic-attribute-input"
        :value="modelValue"
        type="number"
        readonly
      />
      <EpicButton icon="arrow-up" icononly @click="() => emit('increment')" />
    </div>
  </EpicInputItem>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from 'vue'
import { inputProps, useInput } from './shared/input'
import EpicButton from '@components/EpicButton'
import EpicInputItem from '@components/EpicInputItem'

export default defineComponent({
  name: 'EpicAttributeInput',
  components: {
    EpicButton,
    EpicInputItem,
  },
  props: {
    ...inputProps,
    modelValue: {
      type: Number,
      required: true,
    },
  },
  setup(_, ctx: SetupContext) {
    const { inputEl, inputAttrs, updateValue, focus } = useInput(ctx)

    return {
      inputEl,
      inputAttrs,
      updateValue,
      focus,
      emit: ctx.emit,
    }
  },
  methods: {
    handleIncrement() {
      this.$emit('increment')
    },
    handleDecrement() {
      this.$emit('decrement')
    },
  },
})
</script>

<style lang="scss" scoped>
@import './shared/input.scss';

.epic-attribute-input-controls {
  display: grid;
  grid-template-columns: 3rem 1fr 3rem;
  gap: 0.5rem;
}

.epic-attribute-input {
  @include input;
}
</style>
