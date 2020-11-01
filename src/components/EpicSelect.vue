<template>
  <EpicInputItem :label="label" :input-id="id">
    <select :id="id" @input="handleInput">
      <option v-for="option in options" :key="option.id" :value="option.id">{{
        option.display
      }}</option>
    </select>
  </EpicInputItem>
</template>

<script lang="ts">
import EpicInputItem from '@components/EpicInputItem'
import { defineComponent, PropType, ref, unref, watchEffect } from 'vue'
import { generate } from 'shortid'

export class EpicSelectOption {
  /**
   * @param value
   * @param id If no id is present the select will create on using the shortId package
   * @param display if no display is specified and no slot is provided the value will be interpreted as string
   */
  constructor(
    public readonly value: unknown,
    public readonly id: string = generate(),
    public readonly display: string = String(value)
  ) {}
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
      type: Object as PropType<unknown>,
      default() {
        return null
      },
    },
    label: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const select = ref(null)

    watchEffect(() => {
      const selectValue = unref(select)
      if (selectValue == null) {
        return
      }

      selectValue.value = props.selectedItem?.id
    })

    function handleSelectInput($event: InputEvent) {
      const value = props.options.find((x) => x.id === $event.target.value)
      $event.target.value = props.options.find(
        (x) => x.value === props.selectedItem
      )
      context.emit('update:selected-item', value)
    }

    return {
      select,
      id: generate(),
    }
  },
  methods: {
    handleInput($event) {
      const value = this.options.find((x) => x.value === $event.target.value)
      console.log(
        typeof $event.target.value,
        JSON.stringify($event.target.value, null, '\t'),
        value,
        this.options
      )
      $event.target.value = this.selectedItem?.value
      this.$emit('update:selected-item', value)
    },
  },
})
</script>

<style scoped></style>
