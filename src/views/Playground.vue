<template>
  <div>
    <EpicHeading class="mb-7">{{ name }}</EpicHeading>
    <EpicCard class="mb-8">
      <EpicToggleSection v-model:isOpen="toggleIsOpen">
        <template v-slot:heading>Attributes</template>
        <EpicInput label="Name" v-model="name" class="mb-6" />
        <EpicAttributeInput :attribute="strenght" class="mb-6" />
        <EpicAttributeInput :attribute="stamina" class="mb-6" />
        <EpicAttributeInput :attribute="willpower" class="mb-6" />
      </EpicToggleSection>
    </EpicCard>
    <EpicCard class="mb-8">
      <EpicToggleSection v-model:isOpen="toggleIsOpen2">
        <template v-slot:heading>Attributes</template>
        <EpicInput label="Name" v-model="name" class="mb-6" />
        <EpicAttributeInput :attribute="strenght" class="mb-6" />
        <EpicAttributeInput :attribute="stamina" class="mb-6" />
        <EpicAttributeInput :attribute="willpower" class="mb-6" />
      </EpicToggleSection>
    </EpicCard>
    <EpicCard class="mb-8">
      <EpicInput label="Name" v-model="name" class="mb-6" />
      <EpicAttributeInput :attribute="strenght" class="mb-6" />
      <EpicAttributeInput :attribute="stamina" class="mb-6" />
      <EpicAttributeInput :attribute="willpower" class="mb-6" />
      <EpicButton as="router-link" to="#">Speichern</EpicButton>
    </EpicCard>
  </div>
</template>

<script lang="ts">
import { Attribute } from '@models/attribute'
import { defineComponent, ref } from 'vue'
import EpicCard from '@components/EpicCard.vue'
import EpicHeading from '@components/EpicHeading.vue'
import EpicButton from '@components/EpicButton.vue'
import EpicInput from '@components/EpicInput.vue'
import EpicAttributeInput from '@components/EpicAttributeInput.vue'
import EpicToggleSection from '@components/EpicToggleSection.vue'

export default defineComponent({
  name: 'Playground',
  components: {
    EpicCard,
    EpicHeading,
    EpicButton,
    EpicInput,
    EpicAttributeInput,
    EpicToggleSection,
  },
  setup() {
    const toggleIsOpen = ref(true)
    const toggleIsOpen2 = ref(false)
    const name = ref('Brandur Boraldin')
    const strenght = ref(new Attribute('Stärke'))
    const stamina = ref(new Attribute('Ausdauer'))
    const willpower = ref(new Attribute('Willenskraft'))

    strenght.value.addIncrement(2)
    stamina.value.addIncrement(3)
    willpower.value.addIncrement(6)

    return {
      toggleIsOpen,
      toggleIsOpen2,
      name,
      strenght,
      stamina,
      willpower,
    }
  },
})
</script>
