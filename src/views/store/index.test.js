import { Util, initialState } from './index'
import { clone } from 'ramda'
import { Mat, Rcp } from '../../scripts/CookingUtil'

// describe('hasIngred', () => {
//   it('initialState', () => {
//     let actual   = Util.hasIngred(initialState, 1)
//     let expected = false
//     expect(actual).toBe(expected)
//   })

//   it('Single item of idx 37', () => {
//     const state = { 
//       ...initialState, 
//       ingreds: [{ count: 1, id: 37}], 
//       hasIngreds: true 
//     }

//     let actual   = Util.hasIngred(state, 37)
//     let expected = true
//     expect(actual).toBe(expected)

//     actual   = Util.hasIngred(state, 1)
//     expected = false
//     expect(actual).toBe(expected)
//     actual   = Util.hasIngred(state, 0)
//     expect(actual).toBe(expected)
//   })
// })

describe('getIngredIndex', () => {
  const i1 = {
    count: 1, id: 57, data: Mat.ofId(57)
  }
  const i2 = {
    count: 4, id: 59, data: Mat.ofId(59)
  }

  it('1', () => {
    let state = clone(initialState)
    state.hasIngreds = true
    state.ingreds.push(i1)
    state.ingreds.push(i2)

    let actual   = Util.getIngredIndex(state, 57)
    let expected = 0
    expect(actual).toBe(expected)
    
    actual   = Util.getIngredIndex(state, 59)
    expected = 1
    expect(actual).toBe(expected)

    actual   = Util.getIngredIndex(state, 4)
    expected = -1
    expect(actual).toBe(expected)
  })

  it('2', () => {
    let state = clone(initialState)
    state.hasIngreds = true
    state.ingreds.push(i2)  // Notice i2 comes before i1 this time
    state.ingreds.push(i1)

    let actual   = Util.getIngredIndex(state, 57)
    let expected = 1
    expect(actual).toBe(expected)
    
    actual   = Util.getIngredIndex(state, 59)
    expected = 0
    expect(actual).toBe(expected)

    actual   = Util.getIngredIndex(state, 4)
    expected = -1
    expect(actual).toBe(expected)
  })
});