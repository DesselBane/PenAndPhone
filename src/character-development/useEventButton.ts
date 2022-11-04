import {
  UnknownAttributeDefinitions,
  AttributeGroupDefinitions,
} from './AttributeDefinition'
import { AttributeCalculations, Character } from './CharacterDefinition'
import { Ref, unref } from 'vue'
import { EventDefinitions, EventImpls, ResolvedPayload } from './Events'

export const useEventButtons = <
  TAttributes extends UnknownAttributeDefinitions,
  TAttributeGroups extends AttributeGroupDefinitions<TAttributes>,
  TAttributeCalculations extends AttributeCalculations<TAttributes>,
  TEvents extends EventDefinitions<TAttributes, TAttributeGroups>,
  TEventImpls extends EventImpls<TAttributes, TAttributeGroups, TEvents>
>(
  character: Ref<
    Character<
      TAttributes,
      TAttributeGroups,
      TAttributeCalculations,
      TEvents,
      TEventImpls
    >
  >
) => ({
  getBindings: <TEventType extends keyof TEvents & string>(
    type: TEventType,
    payload: ResolvedPayload<
      TAttributes,
      TAttributeGroups,
      TEvents[TEventType]
    >,
    revert: boolean = false
  ) => {
    const realCharacter = unref(character)
    const validation = revert
      ? realCharacter.validateRevert(type, unref(payload))
      : realCharacter.validate(type, unref(payload))
    const disabled = validation !== true
    let title = undefined
    if (validation !== true) {
      title = validation instanceof Error ? validation.message : validation
    }

    function onClick() {
      if (revert) {
        realCharacter.revert(type, unref(payload))
        return
      }
      realCharacter.execute(type, unref(payload))
    }

    return {
      disabled,
      title,
      onClick,
    }
  },
})
