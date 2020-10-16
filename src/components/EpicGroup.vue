<template>
  <div class="epic-group"><slot /></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EpicGroup',
})
</script>

<style lang="scss" scoped>
@import 'src/styles/shared.scss';

.epic-group {
  display: inline-flex;
  gap: 0.5rem;
}
</style>
