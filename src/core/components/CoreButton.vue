<script lang="ts" setup>
import * as tooltip from '@zag-js/tooltip'
import { nanoid } from 'nanoid'
import { normalizeProps, useMachine } from '@zag-js/vue'
import { computed } from 'vue'

defineProps<{
  title: string | null
  onClick: () => void
}>()

const [state, send] = useMachine(
  tooltip.machine({ id: nanoid(), openDelay: 200, closeDelay: 200 })
)
// TODO: get rid of normalizeProps warning
const api = computed(() => tooltip.connect(state.value, send, normalizeProps))
</script>

<template>
  <button
    ref="ref"
    v-bind="{ ...$attrs, ...api.triggerProps }"
    @click="onClick"
  >
    <slot />
  </button>
  <div v-if="title && api.isOpen" v-bind="api.positionerProps">
    <div v-bind="api.contentProps">{{ title }}</div>
  </div>
</template>
