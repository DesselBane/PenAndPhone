<template>
  <div class="epic-tabbar">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EpicTabbar',
})
</script>

<style lang="scss" scoped>
@import 'src/styles/shared.scss';

.epic-tabbar {
  position: relative;
  display: flex;
  justify-content: space-evenly;
  overflow: hidden;
  box-shadow: 0 0 2px shadow(0.3), 0 -4px 20px 0 shadow(0.3);

  ::before {
    position: absolute;
    top: 0;
    right: -1rem;
    bottom: -1rem;
    left: -1rem;
    content: '';
    pointer-events: none;
    box-shadow: inset 0 0 1px 2px light(0.9), inset 0 0 4px 1px shadow(0.4);
  }

  @include bg-paper('white');
}
</style>
