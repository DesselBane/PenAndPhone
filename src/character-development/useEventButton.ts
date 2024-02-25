import {
  UnknownAttributeDefinitions,
  AttributeGroupDefinitions,
} from './Attributes'
import { AttributeCalculations, Character } from './Character'
import { Ref, unref } from 'vue'
import { EventDefinitions, EventImpls, ResolvedPayload } from './Events'
import { RevertError } from './Errors'

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
  getBindings: <TEventType extends keyof TEvents>(
    type: TEventType,
    payload: ResolvedPayload<
      TAttributes,
      TAttributeGroups,
      TEvents[TEventType]
    >,
    revert: Ref<boolean> | boolean = false
  ) => {
    const realCharacter = unref(character)
    const validation = unref(revert)
      ? realCharacter.validateRevert(type, unref(payload))
      : realCharacter.validate(type, unref(payload))
    const disabled =
      validation instanceof RevertError
        ? validation.isNotIgnorable()
        : validation !== true
    const warning =
      validation instanceof RevertError &&
      validation.hasErrors() &&
      validation.isIgnorable()

    let title = null
    if (validation !== true) {
      title = validation instanceof Error ? validation.message : validation
    }

    function onClick() {
      if (unref(revert)) {
        realCharacter.revert(type, unref(payload))
        return
      }
      realCharacter.execute(type, unref(payload))
    }

    return {
      disabled,
      title,
      onClick,
      class: [warning && 'warning'],
    }
  },
})
