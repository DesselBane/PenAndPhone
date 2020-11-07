<template>
  <EpicInputItem :label="label" :input-id="id">
    <select :id="id" @input="handleSelectInput" :value="selectedId">
      <option
        v-for="option in options"
        :key="option.id"
        :value="option.id"
        :selected="selectedId === option.id"
        >{{ option.display }}</option
      >
    </select>
  </EpicInputItem>
</template>

<script lang="ts">
import EpicInputItem from '@components/EpicInputItem'
import { ReactiveBase } from '@helper/ReactiveBase'
import { computed } from '@vue/reactivity'
import { generate } from 'shortid'
import { defineComponent, PropType } from 'vue'

export class EpicSelectOption extends ReactiveBase {
  /**
   * @param value
   * @param id If no id is present the select will create on using the shortId package
   * @param display if no display is specified and no slot is provided the value will be interpreted as string
   */
  constructor(
    public readonly value: unknown,
    public readonly id: string = generate(),
    public readonly display: string = String(value)
  ) {
    super()
  }
}

export default defineComponent({
  name: 'EpicSelect',
  components: {
    EpicInputItem,
  },
  props: {
    options: {
      type: Array as PropType<EpicSelectOption[]>,
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
  setup(
    props: { options: EpicSelectOption[]; selectedItem: unknown },
    context
  ) {
    function handleSelectInput($event: InputEvent) {
      const value = props.options.find((x) => x.id === $event.target.value)
        ?.value

      context.emit('update:selected-item', value)
    }

    const selectedId = computed(
      () => props.options.find((x) => x.value === props.selectedItem)?.id
    )

    return {
      id: generate(),
      handleSelectInput,
      selectedId,
    }
  },
})
</script>

<style scoped></style>
