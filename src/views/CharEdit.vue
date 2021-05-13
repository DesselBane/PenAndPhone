<template>
  <EpicHeading>Editiere: {{ char.name }}</EpicHeading>
  <EpicInput v-model="char.name" label="Name" class="mb-4" />
  <EpicHeading as="h2" class="mb-4 mt-6">Attribute</EpicHeading>
  <EpicIncrementInput
    v-for="attr in attributes"
    :key="attr.id"
    class="mb-2"
    :incrementable="attr"
  />
  <EpicHeading as="h2" class="mb-4 mt-6">Fertigkeiten</EpicHeading>
  <EpicIncrementInput
    v-for="ability in abilities"
    :key="ability.id"
    :incrementable="ability"
    class="mb-4"
  />
  <EpicHeading as="h2" class="mb-4 mt-6">Generelles</EpicHeading>
  <EpicSelect
    v-for="selectableTrait in selectableTraits"
    :key="selectableTrait.label"
    :label="selectableTrait.label"
    :options="selectableTrait.options"
    v-model:selected-item="selectableTrait.value"
  />
  <EpicInput
    v-for="trait in traits"
    :key="trait.label"
    v-model="trait.value"
    :label="trait.label"
    class="mb-4"
  />
  <div class="buttons mt-8">
    <EpicButton @click="cancel">Abbrechen</EpicButton>
    <EpicButton @click="save" primary>Speichern</EpicButton>
  </div>
</template>

<script lang="ts">
import EpicButton from '@components/EpicButton.vue'
import EpicHeading from '@components/EpicHeading.vue'
import EpicIncrementInput from '@components/EpicIncrementInput.vue'
import EpicInput from '@components/EpicInput.vue'
import EpicSelect from '@components/EpicSelect.vue'
import { Ability } from '@models/ability'
import { Attribute } from '@models/attribute'
import { Character } from '@models/character'
import { SelectableTrait, SimpleTrait } from '@models/trait'
import { storeInstance } from '@store/data-store'
import { computed } from '@vue/reactivity'
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'CharEdit',
  components: {
    EpicHeading,
    EpicInput,
    EpicIncrementInput,
    EpicButton,
    EpicSelect,
  },
  setup() {
    const route = useRoute()
    const char = computed(() => {
      return storeInstance.getReference(route.params.charId) as
        | Character
        | undefined
    })
    const traits = computed<SimpleTrait[]>(() => char.value?.traits || [])
    const attributes = computed<Attribute[]>(() => char.value?.attributes || [])
    const abilities = computed<Ability[]>(() => char.value?.abilities || [])
    const selectableTraits = computed<SelectableTrait[]>(
      () => char.value?.selectableTraits || []
    )

    return {
      char,
      traits,
      attributes,
      abilities,
      selectableTraits,
      save: () => storeInstance.save(),
      cancel: () => storeInstance.load(),
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
