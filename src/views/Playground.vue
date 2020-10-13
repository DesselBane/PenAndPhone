<template>
  <div>
    <h1>Playground</h1>
    <EpicCard class="mb-8">
      <EpicHeading as="h2" class="mb-7">Epic Attributes</EpicHeading>
      <p class="epic mb-7">
        Your hero's epic attributes go here. It smells like adventure and old
        socks. But mostly old socks. Your hero's epic attributes go here. It
        smells like adventure and old socks. But mostly old socks.
      </p>
      <EpicInput
        class="mb-7"
        label="New Attribute"
        placeholder="New epic attribute ..."
      />
      <EpicInput
        class="mb-10"
        label="New Attribute"
        placeholder="New epic attribute ..."
      />
      <EpicButton @click="editAttributes">Edit Attributes</EpicButton>
    </EpicCard>
    <EpicCard>
      <EpicHeading as="h2" class="mb-7">Epic Items</EpicHeading>
      <p class="mb-7">Your hero's epic items go here.</p>
      <EpicButton>Edit Items</EpicButton>
    </EpicCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import EpicCard from '@components/EpicCard.vue'
import EpicHeading from '@components/EpicHeading.vue'
import EpicButton from '@components/EpicButton.vue'
import EpicInput from '@components/EpicInput.vue'

export default defineComponent({
  name: 'Playground',
  components: {
    EpicCard,
    EpicHeading,
    EpicButton,
    EpicInput,
  },
  setup() {
    return {
      editAttributes() {
        alert('Edit Epic Attributes')
      },
    }
  },
})
</script>
