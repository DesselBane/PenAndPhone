import { Trait } from '@models/trait'
import { watch } from 'vue'

describe('Trait', () => {
  it('has a observable name', () => {
    const trait = new Trait()
    const spy = jest.fn()

    watch(
      trait.name,
      () => {
        spy()
      },
      { flush: 'sync' }
    )

    trait.name.value = 'foo'

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('has an observable value', () => {
    const trait = new Trait()
    const spy = jest.fn()

    watch(
      trait.value,
      () => {
        spy()
      },
      {
        flush: 'sync',
      }
    )

    trait.value.value = 'foo'
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
