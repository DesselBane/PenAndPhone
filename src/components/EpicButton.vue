<template>
  <component
    :is="as"
    class="epic-button"
    :class="[
      primary && 'epic-button--primary',
      fullwidth && 'epic-button--fullwidth',
      icononly && 'epic-button--icononly',
    ]"
  >
    <EpicIcon class="epic-button-icon" v-if="icon != null" :name="icon" />
    <span class="epic-button-content">
      <slot />
    </span>
  </component>
</template>

<script lang="ts">
import EpicIcon from '@components/EpicIcon.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EpicButton',
  components: {
    EpicIcon,
  },
  props: {
    primary: {
      type: Boolean,
      default: false,
    },
    fullwidth: {
      type: Boolean,
      default: false,
    },
    as: {
      type: String,
      default: 'button',
    },
    icon: {
      type: String,
      default: null,
    },
    icononly: {
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
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.6rem;
  font-size: 1.1rem;
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

  &--fullwidth {
    display: flex;
    width: 100%;
  }

  &--icononly {
    padding: 0.7rem;

    .epic-button-content {
      @include sr-only;
    }
  }

  &:hover,
  &:focus {
    box-shadow: 0 0 2px shadow(0.5), 0 8px 24px -8px shadow(0.8),
      inset 0 0 0 1px light(0.7), inset 0 0 6px 1px shadow(0.6);
  }

  &:active {
    box-shadow: 0 0 2px shadow(0.5), 0 4px 16px -6px shadow(0.8),
      inset 0 0 0 1px light(0.7), inset 0 0 10px 1px shadow(0.9);
  }
}

.epic-button-icon {
  flex-shrink: 0;
  margin-right: 0.5rem;
  filter: drop-shadow(1px 1px 1px shadow(0.5));

  .epic-button--icononly & {
    margin-right: 0;
    font-size: 1.2rem;
  }
}
</style>
