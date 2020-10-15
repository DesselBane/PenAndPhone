<template>
  <button class="epic-button" :class="[primary && 'epic-button--primary']">
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EpicButton',
  props: {
    primary: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style lang="scss" scoped>
@import 'src/styles/shared.scss';

.epic-button {
  all: initial;
  padding: 0.7rem 1.6rem;
  font-size: 1.1rem;
  font-style: italic;
  font-weight: 400;
  color: $color-body;
  text-shadow: 1px 1px 1px shadow(0.5);
  letter-spacing: 0.15em;
  cursor: pointer;
  border-radius: 0.3rem;
  box-shadow: 0 0 2px shadow(0.5), 0 4px 16px -6px shadow(0.8),
    inset 0 0 0 1px light(0.7), inset 0 0 6px 1px shadow(0.6);
  transition: box-shadow 0.1s ease-out;

  @include bg-rock($color-secondary);

  &--primary {
    @include bg-rock($color-primary);
  }

  &:hover {
    box-shadow: 0 0 2px shadow(0.5), 0 8px 24px -8px shadow(0.8),
      inset 0 0 0 1px light(0.7), inset 0 0 6px 1px shadow(0.6);
  }

  &:active {
    box-shadow: 0 0 2px shadow(0.5), 0 4px 16px -6px shadow(0.8),
      inset 0 0 0 1px light(0.7), inset 0 0 10px 1px shadow(0.9);
  }
}
</style>
