<template>
  <EpicHeading>Editiere: {{ char.name }}</EpicHeading>
  <EpicInput v-model="char.name" label="Name" class="mb-2" />
  <EpicHeading as="h2" class="mb-4">{{ defaultTags.attribute }}</EpicHeading>
  <div
    v-for="attr in attributes"
    :key="attr.id"
    class="mb-4"
    style="display: grid; gap: 20px; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: auto auto; "
  >
    <div class="gcs-1-4 gr-1">{{ attr.label }}</div>
    <button class="gc-1 gr-2" @click="() => attr.removeModification()">
      - Remove
    </button>
    <div class="gc-2 gr-2">{{ attr.currentValue }}</div>
    <button class="gc-3 gr-2" @click="() => attr.addModification()">
      + Add
    </button>
    <div class="gr-3 gcs-1-4">
      <div
        v-for="mod in attr.modifications"
        :key="mod.id"
        style="display: grid; grid-template-columns: auto 1fr auto"
      >
        <div class="gc-1">{{ new Date(mod.timestamp).toISOString() }}</div>
        <div class="gc-3">Amount: {{ mod.amount }}</div>
      </div>
    </div>
  </div>
  <EpicHeading as="h2" class="mb-4">{{ defaultTags.generelles }}</EpicHeading>
  <EpicInput
    v-for="trait in generalTagTraits"
    :key="trait.name"
    v-model="trait.value"
    :label="trait.name"
    class="mb-2"
  />
</template>

<script lang="ts">
import EpicHeading from '@components/EpicHeading'
import EpicInput from '@components/EpicInput'
import { Attribute } from '@models/attribute'
import { Character } from '@models/character'
import { DefaultTags } from '@models/tags'
import { Trait } from '@models/trait'
import { computed } from '@vue/reactivity'
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { storeInstance } from '../store/data-store'

export default defineComponent({
  name: 'CharEdit',
  components: {
    EpicHeading,
    EpicInput,
  },
  setup() {
    const route = useRoute()
    const char = computed(() => {
      return storeInstance.getReference(route.params.charId) as
        | Character
        | undefined
    })
    const generalTagTraits = computed<Trait[]>(() => {
      const character = char.value
      if (character == undefined) {
        return []
      }

      return character.traits.filter((x) =>
        x.tags.includes(DefaultTags.generelles)
      )
    })

    const attributes = computed<Attribute[]>(() => {
      const character = char.value
      if (character == undefined) {
        return []
      }

      return character.attributes
    })

    return {
      char,
      defaultTags: DefaultTags,
      generalTagTraits,
      attributes,
    }
  },
})
</script>
