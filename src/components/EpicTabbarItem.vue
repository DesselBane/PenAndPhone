<template>
  <component :is="as" class="epic-tabbar-item">
    <EpicIcon class="icon" v-if="icon != null" :name="icon" />
    <span class="content">
      <slot />
    </span>
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import EpicIcon from '@components/EpicIcon'

export default defineComponent({
  name: 'EpicTabbarItem',
  components: {
    EpicIcon,
  },
  props: {
    as: {
      type: String,
      default: 'button',
    },
    icon: {
      type: String,
      default: null,
    },
  },
})
</script>

<style lang="scss" scoped>
@import 'src/styles/shared.scss';

.epic-tabbar-item {
  all: initial;
  box-sizing: border-box;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0.8rem 0.6rem;
  font-size: 0.8rem;
  font-weight: 400;
  color: $color-text;
  text-shadow: 0.5px 0.5px 0.5px shadow(0.2);
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: box-shadow 0.1s ease-out;

  &.router-link-active {
    color: $color-primary;
  }
}

.icon {
  margin-bottom: 0.2rem;
  font-size: 1.2rem;
  filter: drop-shadow(1px 1px 1px shadow(0.3));
}
</style>
