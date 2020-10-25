<template>
  <div>
    <EpicHeading class="mb-7">{{ name }}</EpicHeading>
    <EpicCard class="mb-8">
      <EpicInput label="Name" v-model="name" class="mb-6" />
      <EpicAttributeInput label="Stärke" v-model="strenght" class="mb-6" />
      <EpicAttributeInput label="Ausdauer" v-model="stamina" class="mb-6" />
      <EpicAttributeInput
        label="Willenskraft"
        v-model="willpower"
        class="mb-6"
      />
      <EpicButton as="router-link" :to="`/game/${id}`">Speichern</EpicButton>
    </EpicCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import EpicCard from '@components/EpicCard.vue'
import EpicHeading from '@components/EpicHeading.vue'
import EpicButton from '@components/EpicButton.vue'
import EpicInput from '@components/EpicInput.vue'
import EpicAttributeInput from '@components/EpicAttributeInput.vue'

export default defineComponent({
  name: 'Playground',
  components: {
    EpicCard,
    EpicHeading,
    EpicButton,
    EpicInput,
    EpicAttributeInput,
  },
  setup() {
    const name = ref('Brandur Boraldin')
    const strenght = ref(2)
    const stamina = ref(3)
    const willpower = ref(1)

    return {
      name,
      strenght,
      stamina,
      willpower,
    }
  },
})
</script>
