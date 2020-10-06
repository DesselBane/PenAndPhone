<template>
  <div class="layout">
    <div>{{ serialized }}</div>
  </div>
</template>

<script lang="ts">
import { Character, NumberAttribute, TextAttribute } from '@models/models'
import { TypedJSON } from 'typedjson'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EditChar',
  components: {},
  data() {
    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      character: {
        name: '',
        totalExp: 0,
      },
    }
  },
  setup() {
    const char = new Character('char.test')
    char.attributes.value.push(
      new TextAttribute('attr.text.name', 'Name', 'Sinthoras'),
      new TextAttribute('attr.text.haircolor', 'Haircolor', 'Schwarz'),
      new NumberAttribute('attr.number.expTotal', 'Exp Total', 0)
    )

    const serialized = new TypedJSON(Character).stringify(char)
    const parsed = new TypedJSON(Character).parse(serialized)

    console.log(char, parsed)

    return {
      char,
      serialized,
    }
  },
})
</script>

<style scoped>
.edit-char__form {
  padding: 12px;
}
</style>
