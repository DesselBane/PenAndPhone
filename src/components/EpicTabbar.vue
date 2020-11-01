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
  display: flex;
  justify-content: space-evenly;
  overflow: hidden;
  box-shadow: 0 0 2px shadow(0.3), 0 -4px 20px 0 shadow(0.3);

  @include bg-paper('white');
}
</style>
