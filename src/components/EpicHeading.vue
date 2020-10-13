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
@import '@styles/shared.scss';

.epic-heading {
  position: relative;
  font-style: italic;
  font-weight: 400;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);

  &::before {
    position: absolute;
    bottom: -0.2em;
    left: 50%;
    width: 100%;
    max-width: 60px;
    height: 1px;
    content: '';
    background-color: $secondary;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.3), 0 4px 16px -6px rgba(0, 0, 0, 0.6);
    opacity: 0.15;
    transform: translateX(-50%);
  }
}
</style>
