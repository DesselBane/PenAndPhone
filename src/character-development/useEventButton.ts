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
  getBindings: <TEventId extends keyof TEvents & string>(
    id: TEventId,
    payload: IResolvedPayload<TAttributes, TAttributeGroups, TEvents[TEventId]>
  ) => {
    const realCharacter = unref(character)
    const validation = realCharacter.validate(id, unref(payload))
    const disabled = validation !== true
    const title = validation !== true ? validation : undefined

    function onClick() {
      realCharacter.execute(id, unref(payload))
    }

    return {
      disabled,
      title,
      onClick,
    }
  },
})
