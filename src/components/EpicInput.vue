<template>
  <EpicInputItem :label="label" :input-id="id">
    <input
      class="epic-input"
      v-bind="inputAttrs"
      :value="modelValue"
      @input="updateValue($event.target.value)"
    />
  </EpicInputItem>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { inputProps, useInput } from './shared/input'
import EpicInputItem from '@components/EpicInputItem'

export default defineComponent({
  name: 'EpicInput',
  components: {
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
      id: ctx._uid,
    }
  },
})
</script>

<style lang="scss" scoped>
@import './shared/input.scss';

.epic-input {
  @include input;
}
</style>
