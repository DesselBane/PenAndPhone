<template>
  <EpicInputItem :label="attribute.label">
    <div class="epic-attribute-input-controls">
      <EpicButton
        icon="arrow-down"
        icononly
        @click="() => attribute.removeIncrement()"
      />
      <input
        class="epic-attribute-input"
        :value="attribute.currentValue"
        type="number"
        readonly
      />
      <EpicButton
        icon="arrow-up"
        icononly
        @click="() => attribute.addIncrement()"
      />
    </div>
  </EpicInputItem>
</template>

<script lang="ts">
import { Attribute } from '@models/attribute'
import { defineComponent } from 'vue'
import EpicButton from '@components/EpicButton'
import EpicInputItem from '@components/EpicInputItem'

export default defineComponent({
  name: 'EpicAttributeInput',
  components: {
    EpicButton,
    EpicInputItem,
  },
  props: {
    attribute: {
      type: Attribute,
      required: true,
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
