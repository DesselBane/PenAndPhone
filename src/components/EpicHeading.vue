<template>
  <component :is="as" class="epic-heading">
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EpicHeading',
  props: {
    as: {
      type: String,
      default: 'h1',
    },
  },
})
</script>

<style lang="scss" scoped>
@import 'src/styles/shared.scss';

h1 {
  color: $color-primary;
}

.epic-heading {
  font-style: italic;
  font-weight: 400;
  text-shadow: 1px 1px 1px shadow(0.1);
}
</style>
