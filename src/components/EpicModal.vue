<template>
  <div
    class="epic-modal"
    v-show="isOpen"
    @click="$emit('update:isOpen', false)"
  >
    <div class="epic-modal-window" @click.stop ref="windowEl">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, Ref, nextTick } from 'vue'
import { getTabbableElements } from '@helper'

export default defineComponent({
  name: 'EpicModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const windowEl: Ref<HTMLElement | null> = ref(null)

    watch(
      () => props.isOpen,
      async (isOpen) => {
        if (isOpen && windowEl.value != null) {
          const tabbableElements = getTabbableElements(windowEl.value)
          await nextTick()
          tabbableElements[0].focus()
        }
      },
      {
        flush: 'post',
        immediate: true,
      }
    )
    return {
      windowEl,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/styles/shared.scss';

.epic-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.2rem;
  background-color: shadow(0.8);
}

.epic-modal-window {
  width: 100%;
  max-width: 480px;
  padding: 1.2rem;
  border-radius: 0.2rem;
  box-shadow: 0 0 2px shadow(0.3), 0 4px 16px -6px shadow(0.6),
    inset 0 0 1px 2px light(0.9), inset 0 0 4px 1px shadow(0.4);

  @include bg-paper('white');
}
</style>
