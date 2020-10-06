<template>
  <a-form-item :label="name">
    <a-input-number :value="value" @change="onChange" />
  </a-form-item>
</template>

<script>
export default {
  name: 'AttributeNumber',
  props: {
    value: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  methods: {
    onChange(value) {
      this.$emit('update:value', value)
    },
  },
}
</script>

<style scoped></style>
