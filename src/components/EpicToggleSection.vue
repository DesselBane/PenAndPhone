<template>
  <div class="epic-toggle-section">
    <EpicHeading @click="toggle" as="h2">
      <span class="heading-inner">
        <slot name="heading" />
        <EpicIcon :name="iconName" class="heading-icon" />
      </span>
    </EpicHeading>
    <div class="content mt-5" v-show="isOpen">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import EpicHeading from '@components/EpicHeading.vue'
import EpicIcon from '@components/EpicIcon.vue'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'EpicToggleSection',
  components: {
    EpicHeading,
    EpicIcon,
  },
  props: {
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    function toggle() {
      emit('update:isOpen', !props.isOpen)
    }
    const iconName = computed(() => (props.isOpen ? 'arrow-up' : 'arrow-down'))
    return {
      toggle,
      iconName,
    }
  },
})
</script>

<style lang="scss" scoped>
@import 'src/styles/shared.scss';

.heading-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
}

.heading-icon {
  flex-shrink: 0;
  filter: drop-shadow(1px 1px 1px shadow(0.3));
}
</style>
