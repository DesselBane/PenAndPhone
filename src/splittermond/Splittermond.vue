<script setup lang="ts">
import { characterDefinition } from './splittermond.rules'
import { Character } from '../character-development/CharacterDefinition'
import { ref } from 'vue'

const character = ref(new Character(characterDefinition))

// Step 1
const name = ref('')
function handleStep1() {
  character.value.execute('nameSetzen', { name: name.value })
  character.value.execute('erschaffungWeiter', 2)
}
// Step 2
const rasseOptionen = characterDefinition.attributes.rasse.options
const rasse = ref<typeof rasseOptionen[number]>(rasseOptionen[0])
function handleStep2() {
  character.value.execute('rasseSetzen', { rasse: rasse.value })
  character.value.execute('erschaffungWeiter', 3)
}
</script>

<template>
  <h1>Splittermond</h1>
  <main>
    <div class="steps">
      <form
        v-if="character.getAttribute('erschaffungsZustand').value === 1"
        @submit.prevent="handleStep1"
      >
        <h1>1 Idee</h1>
        <label>
          Name:
          <input v-model="name" />
        </label>
        <button>Speichern & Weiter</button>
      </form>
      <form
        v-else-if="character.getAttribute('erschaffungsZustand').value === 2"
        @submit.prevent="handleStep2"
      >
        <h1>2 Rasse</h1>
        <label>
          Rasse:
          <select v-model="rasse">
            <option
              v-for="option in rasseOptionen"
              :value="option"
              :key="option"
            >
              {{ option }}
            </option>
          </select>
        </label>
        <button>Speichern & Weiter</button>
      </form>
      <form
        v-else-if="character.getAttribute('erschaffungsZustand').value === 3"
        @submit.prevent=""
      >
        <h1>3 Kultur</h1>
        <button>Speichern & Weiter</button>
      </form>
    </div>
    <div class="state">
      <div
        v-for="(attributeKeys, groupKey) in characterDefinition.groups"
        :key="groupKey"
      >
        <h2>{{ groupKey }}</h2>
        <dl v-for="key in attributeKeys" :key="key">
          <dt>{{ key }}</dt>
          <dd>
            {{ character.getAttribute(key).value }} ({{
              character.getAttribute(key).rawValue
            }})
          </dd>
        </dl>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4rem;
  text-align: left;
}

form {
  display: grid;
  gap: 2rem;
}

.state {
  display: grid;
  gap: 3rem;
}

dl {
  display: grid;
  grid-template-columns: 1fr auto;
}

dt,
dd {
  border-block-end: 1px solid lightgray;
  margin: 0;
  padding: 0.2rem;
}

dd {
  padding-inline-start: 2rem;
  font-weight: bold;
}
</style>
