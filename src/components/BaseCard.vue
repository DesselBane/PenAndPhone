<template>
  <div class="base-card">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseCard',
})
</script>

<style lang="scss" scoped>
@import '@styles/shared.scss';

.base-card {
  padding: 2rem;
  border-radius: 0.2rem;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3), 0 4px 16px -6px rgba(0, 0, 0, 0.6),
    inset 0 0 1px 2px rgba(255, 255, 255, 0.9),
    inset 0 0 4px 1px rgba(0, 0, 0, 0.4);

  @include bg-paper('white');
}
</style>
