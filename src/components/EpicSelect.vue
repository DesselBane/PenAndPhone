<template>
  <EpicInputItem :label="label" :input-id="id">
    <select :id="id" @input="handleSelectInput" :value="selectedItem">
      <option
        v-for="option in options"
        :key="option"
        :value="option"
        :selected="selectedItem === option"
      >
        {{ option }}
      </option>
    </select>
  </EpicInputItem>
</template>

<script lang="ts">
import EpicInputItem from '@components/EpicInputItem.vue'
import { generate } from 'shortid'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'EpicSelect',
  components: {
    EpicInputItem,
  },
  props: {
    options: {
      type: Array as PropType<unknown>,
      required: true,
    },
    selectedItem: {
      default() {
        return null
      },
    },
    label: {
      type: String,
      required: true,
    },
  },
  setup(props: { options: unknown[]; selectedItem: unknown }, context) {
    function handleSelectInput($event: InputEvent) {
      context.emit('update:selected-item', $event.target.value)
    }

    return {
      id: generate(),
      handleSelectInput,
    }
  },
})
</script>

<style scoped></style>
