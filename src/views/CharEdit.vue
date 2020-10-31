<template>
  <EpicHeading>Editiere: {{ char.name }}</EpicHeading>
  <EpicInput v-model="char.name" label="Name" class="mb-4" />
  <EpicHeading as="h2" class="mb-4 mt-6">{{
    defaultTags.attribute
  }}</EpicHeading>
  <EpicIncrementInput
    v-for="attr in getAttributeTagAttributes"
    :key="attr.id"
    class="mb-2"
    :incrementable="attr"
  />
  <EpicHeading as="h2" class="mb-4 mt-6"
    >{{ defaultTags.fertigkeiten }}
  </EpicHeading>
  <EpicIncrementInput
    v-for="ability in abilities"
    :key="ability.id"
    :incrementable="ability"
    class="mb-4"
  />
  <EpicHeading as="h2" class="mb-4 mt-6">{{
    defaultTags.generelles
  }}</EpicHeading>
  <EpicInput
    v-for="trait in generalTagTraits"
    :key="trait.name"
    v-model="trait.value"
    :label="trait.name"
    class="mb-4"
  />
  <div class="buttons mt-8">
    <EpicButton @click="cancel">Abbrechen</EpicButton>
    <EpicButton @click="save" primary>Speichern</EpicButton>
  </div>
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
import EpicButton from '@components/EpicButton'
import EpicIncrementInput from '@components/EpicIncrementInput'

export default defineComponent({
  name: 'CharEdit',
  components: {
    EpicHeading,
    EpicInput,
    EpicIncrementInput,
    EpicButton,
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

    const getAttributeTagAttributes = computed<Attribute[]>(() => {
      const character = char.value
      if (character == undefined) {
        return []
      }

      return character.attributes.filter((x) =>
        x.tags.includes(DefaultTags.attribute)
      )
    })

    const abilities = computed(() => {
      const character = char.value
      if (character == undefined) {
        return []
      }

      return character.abilities
    })

    function save() {
      storeInstance.save()
    }
    function cancel() {
      storeInstance.load()
    }

    return {
      char,
      defaultTags: DefaultTags,
      generalTagTraits,
      getAttributeTagAttributes,
      abilities,
      save,
      cancel,
    }
  },
})
</script>
<style scoped lang="scss">
.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
</style>
