<template>
  <div class="epic-card">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EpicCard',
})
</script>

<style lang="scss" scoped>
@import '@styles/shared.scss';

.epic-card {
  padding: 2rem;
  border-radius: 0.2rem;
  box-shadow: 0 0 2px shadow(0.3), 0 4px 16px -6px shadow(0.6),
    inset 0 0 1px 2px light(0.9), inset 0 0 4px 1px shadow(0.4);

  @include bg-paper('white');
}
</style>
