<template>
  <EpicInputItem :label="incrementable.name">
    <div class="epic-increment-input-controls">
      <EpicButton
        icon="arrow-down"
        icononly
        @click="() => incrementable.removeIncrement()"
      />
      <!--suppress HtmlFormInputWithoutLabel -->
      <input
        class="epic-increment-input"
        :value="incrementable.currentValue"
        type="number"
        readonly
      />
      <EpicButton
        icon="arrow-up"
        icononly
        @click="() => incrementable.addIncrement()"
      />
    </div>
  </EpicInputItem>
</template>

<script lang="ts">
import { Incrementable } from '@models/increment'
import { defineComponent, PropType } from 'vue'
import EpicButton from '@components/EpicButton'
import EpicInputItem from '@components/EpicInputItem'

export default defineComponent({
  name: 'EpicIncrementInput',
  components: {
    EpicButton,
    EpicInputItem,
  },
  props: {
    incrementable: {
      type: Object as PropType<Incrementable>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
@import './shared/input.scss';

.epic-increment-input-controls {
  display: grid;
  grid-template-columns: 3rem 1fr 3rem;
  gap: 0.5rem;
}

.epic-increment-input {
  @include input;
}
</style>
