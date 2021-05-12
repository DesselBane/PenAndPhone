<template>
  <EpicHeading>Übersicht: {{ char.name }}</EpicHeading>
  <EpicHeading as="h2" class="mb-2">Attribute</EpicHeading>
  <div class="container">
    <template v-for="attr in attributes" :key="attr.id">
      <span class="value">{{ attr.currentValue }}</span
      ><span class="label">{{ attr.name }}</span>
    </template>
  </div>

  <EpicHeading as="h2" class="mt-6 mb-2">Fertigkeiten</EpicHeading>
  <div class="container">
    <template v-for="ability in abilities" :key="ability.id">
      <span class="value">{{ ability.currentValue }}</span
      ><span class="label">{{ ability.name }}</span>
    </template>
  </div>

  <EpicHeading as="h2" class="mt-6 mb-2">Generelles</EpicHeading>
  <div class="container-single">
    <template v-for="trait in traits" :key="trait.name">
      <span class="label">{{ trait.name }}</span
      ><span class="value">{{ trait.value }}</span>
    </template>
  </div>
</template>

<script lang="ts">
import EpicHeading from '@components/EpicHeading.vue'
import { Ability } from '@models/ability'
import { Attribute } from '@models/attribute'
import { Character } from '@models/character'
import { Trait } from '@models/trait'
import { storeInstance } from '@store/data-store'
import { computed } from '@vue/reactivity'
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'CharOverview',
  components: {
    EpicHeading,
  },
  setup() {
    const route = useRoute()
    const char = computed(() => {
      return storeInstance.getReference(route.params.charId) as
        | Character
        | undefined
    })

    const traits = computed<Trait[]>(() => char.value?.traits || [])
    const attributes = computed<Attribute[]>(() => char.value?.attributes || [])
    const abilities = computed<Ability[]>(() => char.value?.abilities || [])

    return {
      char,
      traits,
      attributes,
      abilities,
    }
  },
})
</script>

<style scoped lang="scss">
@import 'src/styles/shared.scss';

.container {
  display: grid;
  grid-template-columns: auto 1fr auto 1fr;
  column-gap: 0.4rem;
}

.container-single {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.label {
  font-weight: 600;
  color: rgba($color-text, 0.65);
  text-align: left;
  letter-spacing: 0.05em;
}

.value {
  font-weight: bold;
}
</style>
