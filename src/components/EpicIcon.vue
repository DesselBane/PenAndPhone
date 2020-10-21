<template>
  <component :is="svg" class="epic-icon" />
</template>

<script lang="ts">
import { defineComponent, shallowRef, watchEffect } from 'vue'

export default defineComponent({
  name: 'EpicIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const svg = shallowRef(null)

    watchEffect(() => {
      try {
        svg.value = require(`./icons/${props.name}.vue`).default
      } catch (e) {
        console.warn(`Icon component for '${name}' does not exist.`)
      }
    })

    return {
      svg,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/styles/shared.scss';

.epic-icon {
  width: 1em;
  height: 1em;
}
</style>
