import {
  TUnknownAttributeDefinitions,
  IAttributeGroupDefinitions,
} from './AttributeDefinition'
import {
  IAttributeCalculations,
  IEventDefinitions,
  IEventImpls,
  Character,
  IResolvedPayload,
} from './CharacterDefinition'
import { Ref, unref } from 'vue'

export const useEventButtons = <
  TAttributes extends TUnknownAttributeDefinitions,
  TAttributeGroups extends IAttributeGroupDefinitions<TAttributes>,
  TAttributeCalculations extends IAttributeCalculations<TAttributes>,
  TEvents extends IEventDefinitions<TAttributes, TAttributeGroups>,
  TEventImpls extends IEventImpls<TAttributes, TAttributeGroups, TEvents>
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
    payload: IResolvedPayload<
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
