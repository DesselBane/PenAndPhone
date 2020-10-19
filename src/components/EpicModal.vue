<template>
  <transition name="modal">
    <div
      class="epic-modal"
      v-show="isOpen"
      @click="$emit('update:isOpen', false)"
    >
      <div class="epic-modal-window" @click.stop ref="windowEl">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, watch, ref, Ref, nextTick } from 'vue'
import { getTabbableElements } from '@helper'
import { onBeforeRouteLeave } from 'vue-router'

export default defineComponent({
  name: 'EpicModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    /**
     * When set to true and the modal is open any navigation which would leave the current view is blocked and the modal is closed instead.
     */
    blockNavigationOnOpen: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, context) {
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

    onBeforeRouteLeave(() => {
      if (props.blockNavigationOnOpen === true && props.isOpen === true) {
        context.emit('update:isOpen', false)
        return false
      }
    })
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
  background-color: shadow(0.7);
  box-shadow: inset 0 0 140px 1px shadow(0.8);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.epic-modal-window {
  width: 100%;
  max-width: 480px;
  padding: 1.2rem;
  border-radius: 0.2rem;
  box-shadow: 0 0 2px shadow(0.3), 0 4px 16px -6px shadow(0.6),
    inset 0 0 1px 2px light(0.9), inset 0 0 4px 1px shadow(0.4);

  @include bg-paper('white');

  .modal-enter-active &,
  .modal-leave-active & {
    transition: all 0.25s cubic-bezier(0.175, 0.885, 0.2, 1.2);
  }

  .modal-enter-from &,
  .modal-leave-to & {
    transform: translateY(100%);
  }
}
</style>
