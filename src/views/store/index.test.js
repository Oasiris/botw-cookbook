import { Util, initialState } from './index'

describe('hasIngred', () => {
  it('initialState', () => {
    let actual   = Util.hasIngred(initialState, 1)
    let expected = false
    expect(actual).toBe(expected)
  })

  it('Single item of idx 37', () => {
    const state = { 
      ...initialState, 
      ingreds: [{ count: 1, id: 37}], 
      hasIngreds: true 
    }

    let actual   = Util.hasIngred(state, 37)
    let expected = true
    expect(actual).toBe(expected)

    actual   = Util.hasIngred(state, 1)
    expected = false
    expect(actual).toBe(expected)
    actual   = Util.hasIngred(state, 0)
    expect(actual).toBe(expected)
  })
})