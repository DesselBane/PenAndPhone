<template>
  <EpicHeading>Editiere: {{ char.name }}</EpicHeading>
  <EpicInput v-model="char.name" label="Name" class="mb-4" />
  <EpicSelect
    label="Race"
    :options="raceOptions"
    v-model:selected-item="char.race.name"
  />
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
  <EpicInput
    v-for="trait in traits"
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
import EpicSelect, { EpicSelectOption } from '@components/EpicSelect'
import { Ability } from '@models/ability'
import { Attribute } from '@models/attribute'
import { Character } from '@models/character'
import { Races } from '@models/race'
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
    EpicSelect,
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

    const raceOptions = []
    for (const race in Races) {
      raceOptions.push(new EpicSelectOption(race, race, race))
    }

    return {
      char,
      traits,
      attributes,
      abilities,
      raceOptions,
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
