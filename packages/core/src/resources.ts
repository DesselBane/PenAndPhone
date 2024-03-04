import { ConditionalKeys } from 'type-fest'
import { UnknownAttributeDefinition } from './attributes'
import { ObjectToTuple } from './helper'

export type UnknownResourceConfig = ResourceConfig<any>

export type ResourceConfig<TAvailableAttributIds> = {
  availableAttributIds: TAvailableAttributIds
}

export type ResourceDefinitions<TResourceConfig extends UnknownResourceConfig> =
  Record<string, ResourceDefinition<TResourceConfig, any>>

type onlyProp<TResurceDefinition extends ResourceDefinitions<any>> =
  TResurceDefinition[ConditionalKeys<
    TResurceDefinition,
    {
      attribut: [any, any]
    }
  >]['attribut'][0]

type onlyAttributeDefinition<
  TResurceDefinition extends ResourceDefinitions<any>,
  TProp extends string,
> = TResurceDefinition[ConditionalKeys<
  TResurceDefinition,
  {
    attribut: [TProp, any]
  }
>]['attribut'][1]

export type OnlyAttributDefinitions<
  TResourceDefinitions extends ResourceDefinitions<any>,
> = {
  [prop in onlyProp<TResourceDefinitions>]: onlyAttributeDefinition<
    TResourceDefinitions,
    prop
  >
}

export function onlyAttributeDefinitions<
  TResourceDefinitions extends ResourceDefinitions<any>,
>(
  resourceDefinitions: TResourceDefinitions
): OnlyAttributDefinitions<TResourceDefinitions> {
  // TODO test this method !!!
  return Object.entries(resourceDefinitions)
    .filter(([_, definition]) => {
      return Array.isArray(definition.attribut)
    })
    .reduce((previousValue, [name, definition]) => {
      return {
        ...previousValue,
        [name]: definition,
      }
    }, {}) as any
}

export type CostDefinition<
  TResourceDefinitions extends ResourceDefinitions<any>,
> = ObjectToTuple<{
  [prop in keyof TResourceDefinitions]: TResourceDefinitions[prop]['costType']
}>

export type ResourceDefinition<
  TResourceConfig extends UnknownResourceConfig,
  TResourceCostType,
> = {
  attribut:
    | TResourceConfig['availableAttributIds']
    | [
        attributName: string,
        attributeDefinition: UnknownAttributeDefinition<
          TResourceConfig['availableAttributIds']
        >,
      ]
  costType: TResourceCostType
}
/*
const foo = {
  bar: {
    attribut: 'foo',
    costType: [0, 0, 0] as [number, number, number],
  },
  baz: {
    attribut: 'foo',
    costType: '' as string,
  },
} as const satisfies ResourceDefinitions<any>

function bar(_costs: Simplify<CostDefinitions<typeof foo>>) {}

bar([
  ['bar', [0, 0, 0]],
  ['baz', 'foo'],
])
 */
