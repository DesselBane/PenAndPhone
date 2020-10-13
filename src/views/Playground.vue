<template>
  <div>
    <h1>Playground</h1>
    <BaseCard class="mb-8">
      <BaseHeading as="h2" class="mb-7">Epic Attributes</BaseHeading>
      <p class="epic mb-7">
        Your hero's epic attributes go here. It smells like adventure and old
        socks. But mostly old socks. Your hero's epic attributes go here. It
        smells like adventure and old socks. But mostly old socks.
      </p>
      <BaseInput
        class="mb-7"
        label="New Attribute"
        placeholder="New epic attribute ..."
      />
      <BaseInput
        class="mb-10"
        label="New Attribute"
        placeholder="New epic attribute ..."
      />
      <BaseButton @click="editAttributes">Edit Attributes</BaseButton>
    </BaseCard>
    <BaseCard>
      <BaseHeading as="h2" class="mb-7">Epic Items</BaseHeading>
      <p class="mb-7">Your hero's epic items go here.</p>
      <BaseButton>Edit Items</BaseButton>
    </BaseCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseCard from '@components/BaseCard.vue'
import BaseHeading from '@components/BaseHeading.vue'
import BaseButton from '@components/BaseButton.vue'
import BaseInput from '@components/BaseInput.vue'

export default defineComponent({
  name: 'Playground',
  components: {
    BaseCard,
    BaseHeading,
    BaseButton,
    BaseInput,
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
