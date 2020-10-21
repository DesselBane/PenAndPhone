<template>
  <EpicHeading>Editiere: {{ char.name }}</EpicHeading>
  <EpicInput v-model="char.name" label="Name" class="mb-2" />
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
import { Character } from '@models/character'
import { Trait } from '@models/trait'
import { computed } from '@vue/reactivity'
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { storeInstance } from '../store/data-store'
import { DefaultTags } from '@models/tags'

export default defineComponent({
  name: 'CharEdit',
  components: {
    EpicHeading,
    EpicInput,
  },
  setup() {
    const route = useRoute()
    const char = computed(() => {
      const data = storeInstance.getReference(route.params.charId) as
        | Character
        | undefined
      return data
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

    return {
      char,
      defaultTags: DefaultTags,
      generalTagTraits,
    }
  },
})
</script>
