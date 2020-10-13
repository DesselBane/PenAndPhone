<template>
  <button class="base-button">
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseButton',
})
</script>

<style lang="scss" scoped>
@import '@styles/shared.scss';

.base-button {
  all: initial;
  padding: 0.7rem 1.6rem;
  font-size: 1.1rem;
  font-style: italic;
  font-weight: 400;
  color: $body;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.15em;
  cursor: pointer;
  border-radius: 0.3rem;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5), 0 4px 16px -6px rgba(0, 0, 0, 0.8),
    inset 0 0 0 1px rgba(255, 255, 255, 0.7),
    inset 0 0 6px 1px rgba(0, 0, 0, 0.6);
  transition: box-shadow 0.1s ease-out;

  @include bg-rock($secondary);

  &:hover {
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5), 0 8px 24px -8px rgba(0, 0, 0, 0.8),
      inset 0 0 0 1px rgba(255, 255, 255, 0.7),
      inset 0 0 6px 1px rgba(0, 0, 0, 0.6);
  }

  &:active {
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5), 0 4px 16px -6px rgba(0, 0, 0, 0.8),
      inset 0 0 0 1px rgba(255, 255, 255, 0.7),
      inset 0 0 10px 1px rgba(0, 0, 0, 0.9);
  }
}
</style>
