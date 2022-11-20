<script setup lang="ts">
import { ref, unref } from 'vue'

import { Character } from '../character-development/Character'
import { useEventButtons } from '../character-development/useEventButton'
import CoreButton from '../core/components/CoreButton.vue'

import { fertigkeitenGruppen, fertigkeitenAttribute } from './Fertigkeiten'
import { meisterschaftenInFertigkeit } from './Meisterschaften'
import { erschaffungDefinition as characterDefinition } from './Erschaffung'

import { magieschulen, Magieschule } from './zauberei/Magieschulen'
import { zauberInSchule } from './zauberei/Zauber'

const showHistory = ref(true)
const character = ref(new Character(characterDefinition))

const getButtonBindings = useEventButtons(character).getBindings

const valueOf = (id: keyof typeof characterDefinition['attributes']) =>
  character.value.getAttribute(id).value
const rawValueOf = (id: keyof typeof characterDefinition['attributes']) =>
  character.value.getAttribute(id).rawValue

// Step 1
const name = ref('')
function handleStep1() {
  character.value.execute('nameSetzen', { name: name.value })
  character.value.execute('erschaffungWeiter', {})
}
// Step 2
const rasseOptionen = characterDefinition.attributes.rasse.options
const rasse = ref<typeof rasseOptionen[number]>(rasseOptionen[0])
function handleStep2() {
  character.value.execute('rasseSetzen', { rasse: rasse.value })
  character.value.execute('erschaffungWeiter', {})
}

const erfahrungspunkte = ref(10)
function erfahrungspunkteHinzufuegen() {
  character.value.execute('erfahrungspunkteHinzufuegen', {
    menge: unref(erfahrungspunkte),
  })
}
</script>

<template>
  <h1>Splittermond</h1>
  <main>
    <div class="steps">
      <form
        v-if="valueOf('erschaffungsZustand') === 1"
        @submit.prevent="handleStep1"
      >
        <h2>1 Idee</h2>
        <label>
          Name:
          <input v-model="name" />
        </label>
        <button>Speichern & Weiter</button>
      </form>
      <form
        v-else-if="valueOf('erschaffungsZustand') === 2"
        @submit.prevent="handleStep2"
      >
        <h2>2 Rasse</h2>
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
      <form v-else-if="valueOf('erschaffungsZustand') === 3" @submit.prevent="">
        <h2>3 Feinschliff</h2>
        <div>
          <h2>Attribute</h2>
          <p>
            Attributpunkte zu verteilen:
            {{ valueOf('attributPunkte') }}
          </p>
          <dl>
            <template
              v-for="key in characterDefinition.groups.attribute"
              :key="key"
            >
              <dt>{{ key }}</dt>
              <dd>
                {{ valueOf(key) }} ({{ rawValueOf(key) }})
                <CoreButton
                  v-bind="
                    getButtonBindings(
                      'attributSteigernMitPunkt',
                      {
                        attribut: key,
                      },
                      true
                    )
                  "
                >
                  -
                </CoreButton>
                <CoreButton
                  v-bind="
                    getButtonBindings('attributSteigernMitPunkt', {
                      attribut: key,
                    })
                  "
                >
                  +
                </CoreButton>
              </dd>
            </template>
          </dl>
        </div>
        <div>
          <h2>Fertigkeiten</h2>
          <p>
            Fertigkeitspunkte zu verteilen:
            {{ valueOf('freieFertigkeitsPunkte') }}
          </p>
          <p>
            Heldengrad:
            {{ valueOf('heldengrad') }}
          </p>
          <p>
            Erfahrungspunkte:
            {{ valueOf('erfahrungspunkte') }} (eingesetzt:
            {{ valueOf('erfahrungspunkteEingesetzt') }})
          </p>
          <p>
            <input v-model="erfahrungspunkte" type="number" />
            <button @click="erfahrungspunkteHinzufuegen" type="button">
              Erfahrungspunkte hinzufügen
            </button>
          </p>
          <p>
            Meisterschaftspunkte zu verteilen:
            {{ valueOf('meisterschaftsPunkte') }}
          </p>
          <div
            v-for="(fertigkeiten, gruppe) in fertigkeitenGruppen"
            :key="gruppe"
          >
            <h3>{{ gruppe }}</h3>
            <div class="columns-2">
              <div v-for="fertigkeit in fertigkeiten" :key="fertigkeit">
                <dl>
                  <dt>{{ fertigkeit }}</dt>
                  <dd>
                    {{ valueOf(fertigkeit) }} ({{ rawValueOf(fertigkeit) }})
                    <CoreButton
                      v-bind="
                        getButtonBindings(
                          'fertigkeitSteigern',
                          {
                            fertigkeit: fertigkeit,
                          },
                          true
                        )
                      "
                    >
                      -
                    </CoreButton>
                    <CoreButton
                      v-bind="
                        getButtonBindings('fertigkeitSteigern', {
                          fertigkeit: fertigkeit,
                        })
                      "
                    >
                      +
                    </CoreButton>
                    <div
                      class="labels"
                      v-if="fertigkeit in fertigkeitenAttribute"
                    >
                      <span
                        v-for="attribut in fertigkeitenAttribute[fertigkeit as keyof typeof fertigkeitenAttribute]"
                        :key="attribut"
                        class="label"
                      >
                        {{ attribut.substring(0, 3) }}: {{ valueOf(attribut) }}
                      </span>
                    </div>
                  </dd>
                </dl>
                <div>
                  <div class="labels">
                    <span
                      v-for="grad in valueOf(
                        `${fertigkeit}MeisterschaftsPunkte`
                      )"
                      :key="grad"
                      class="label"
                    >
                      Grad {{ grad }} kostenlos
                    </span>
                  </div>
                  <CoreButton
                    v-for="meisterschaft in meisterschaftenInFertigkeit(
                      fertigkeit
                    )"
                    :key="meisterschaft.name"
                    v-bind="{
                      ...getButtonBindings(
                        'meisterschaftLernen',
                        {
                          name: meisterschaft.name,
                        },
                        character.rawAttributes.meisterschaften.includes(
                          meisterschaft.name
                        )
                      ),
                      ...(character.rawAttributes.meisterschaften.includes(
                        meisterschaft.name
                      )
                        ? { class: 'active' }
                        : {}),
                    }"
                  >
                    {{ meisterschaft.name }}
                  </CoreButton>
                </div>
                <div v-if="magieschulen.includes(fertigkeit as Magieschule)">
                  <div class="labels">
                    <span
                      v-for="grad in valueOf(`${fertigkeit as Magieschule}ZauberPunkte`)"
                      :key="grad"
                      class="label"
                    >
                      Zauber {{ grad }} kostenlos
                    </span>
                  </div>
                  <CoreButton
                    v-for="zauber in zauberInSchule(fertigkeit as Magieschule)"
                    :key="zauber.name"
                    v-bind="{
                      ...getButtonBindings(
                        'zauberLernen',
                        {
                          schule: fertigkeit as Magieschule,
                          name: zauber.name,
                        },
                        character.rawAttributes[`${fertigkeit as Magieschule}Zauber`].includes(
                          zauber.name
                        )
                      ),
                      ...(character.rawAttributes[
                        `${fertigkeit as Magieschule}Zauber`
                      ].includes(zauber.name)
                        ? { class: 'active' }
                        : {}),
                    }"
                  >
                    {{ zauber.name }}
                  </CoreButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button
          :disabled="
            valueOf('attributPunkte') > 0 ||
            valueOf('freieFertigkeitsPunkte') > 0
          "
        >
          Speichern & Weiter
        </button>
      </form>
    </div>
    <aside>
      <div class="aside-buttons">
        <button
          @click="showHistory = true"
          :class="[showHistory === true && 'active']"
        >
          History
        </button>
        <button
          @click="showHistory = false"
          :class="[showHistory === false && 'active']"
        >
          State
        </button>
      </div>

      <div v-if="showHistory" class="history">
        <TransitionGroup name="event">
          <div
            v-for="event in character.history.toArray().reverse()"
            :key="event.id"
            class="event"
          >
            <h4>{{ event.type }}</h4>
            <small>ID: {{ event.id }}</small>
            <h5>Payload</h5>
            <code>
              <pre>{{ event.payload }}</pre>
            </code>
            <h5>Mutations</h5>
            <code v-for="(mutation, index) in event.mutations" :key="index">
              <pre>{{ mutation }}</pre>
            </code>
          </div>
        </TransitionGroup>
      </div>
      <div v-else>
        <div
          v-for="(groupValues, groupKey) in characterDefinition.groups"
          :key="groupKey"
        >
          <h2>{{ groupKey }}</h2>
          <dl>
            <template v-for="key in groupValues" :key="key">
              <dt>{{ key }}</dt>
              <dd>{{ valueOf(key) }} ({{ rawValueOf(key) }})</dd>
            </template>
          </dl>
        </div>
      </div>
    </aside>
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

aside {
  width: 20rem;
}

.aside-buttons {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr;
  height: 3rem;
}

.history {
  padding-block-start: 1rem;
  position: relative;
}

.event {
  background: rgb(237, 235, 254);
  padding: 0.4rem;
  border-radius: 0.2rem;
  margin-bottom: 0.2rem;
  width: 100%;
}

.event h4,
.event h5 {
  margin: 0.1rem;
}

.event p {
  margin: 0.1rem;
  color: lightslategray;
}

.event pre {
  background: rgb(217, 210, 241);
  padding: 0.3rem;
  border-radius: 0.2rem;
  color: rgb(170, 15, 64);
  margin: 0.1rem;
  font-size: 0.8rem;
  line-height: 1rem;
}

.columns-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

dl {
  display: grid;
  grid-template-columns: 1fr auto;
  margin: 0;
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

.event-move,
.event-enter-active,
.event-leave-active {
  transition: all 0.5s ease;
}

.event-enter-from,
.event-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.event-leave-active {
  position: absolute;
}

.labels {
  display: flex;
  gap: 0.2rem;
  margin-top: 0.2rem;
}

.label {
  font-size: 0.8rem;
  display: inline-block;
  padding: 0 0.4rem;
  border-radius: 0.5rem;
  background: rgb(217, 210, 241);
}
</style>
