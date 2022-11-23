import { expect } from 'vitest'
import {
  UnknownAttributeDefinitions,
  AttributeGroupDefinitions,
  AttributeState,
} from './Attributes'
import {
  AttributeCalculations,
  CharacterDefinition,
  Character,
} from './Character'
import { EventDefinitions, EventImpls } from './Events'

export function createTestSetup<
  TAttributes extends UnknownAttributeDefinitions,
  TAttributeGroups extends AttributeGroupDefinitions<TAttributes>,
  TAttributeCalculations extends AttributeCalculations<TAttributes>,
  TEvents extends EventDefinitions<TAttributes, TAttributeGroups>,
  TEventImpls extends EventImpls<TAttributes, TAttributeGroups, TEvents>
>(
  definition: CharacterDefinition<
    TAttributes,
    TAttributeGroups,
    TAttributeCalculations,
    TEvents,
    TEventImpls
  >
) {
  function setState(
    character: Character<
      TAttributes,
      TAttributeGroups,
      TAttributeCalculations,
      TEvents,
      TEventImpls
    >,
    state: Partial<AttributeState<TAttributes>>
  ) {
    Object.entries(state).forEach(
      <TKey extends keyof AttributeState<TAttributes>>([
        attribute,
        value,
      ]: any) => {
        character.rawAttributes[attribute as TKey] = value as AttributeState<
          typeof definition['attributes']
        >[TKey]
      }
    )
  }

  function setupTest(initialState: Partial<AttributeState<TAttributes>> = {}) {
    const character = new Character(definition)
    setState(character, initialState)

    const getValue = (attribute: keyof typeof character.attributes) =>
      character.getAttribute(attribute).value

    const expectState = (state: Partial<AttributeState<TAttributes>>) =>
      expect(character.attributes).toEqual(expect.objectContaining(state))

    return {
      character,
      getValue,
      setState: (state: Partial<AttributeState<TAttributes>>) =>
        setState(character, state),
      expectState,
    }
  }

  return {
    setupTest,
  }
}
