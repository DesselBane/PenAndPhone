import { Character } from '@models/character'
import { watch } from 'vue'

describe('character', () => {
  it('has a obersvable name', () => {
    const char = new Character()
    const spy = jest.fn()

    watch(
      char.name,
      () => {
        spy()
      },
      { flush: 'sync' }
    )

    char.name.value = 'foo'

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
