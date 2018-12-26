import { Util, initialState, reductions as redux } from './index'
import { clone } from 'ramda'
import { Mat, Rcp } from '../../scripts/CookingUtil'
import { exists } from '../../scripts/utility';

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

// Helpers

const initSt = () => clone(initialState)

describe('Util', () => {
  describe('getIngredIndex', () => {
    const i57 = {
      count: 1, id: 57, data: Mat.ofId(57)
    }
    const i59 = {
      count: 4, id: 59, data: Mat.ofId(59)
    }

    it('1', () => {
      let state = initSt()
      // state.hasIngreds = true
      state.ingreds.push(i57)
      state.ingreds.push(i59)
      state.ingredCount = 2

      let actual = Util.getIngredIndex(state, 57)
      let expected = 0
      expect(actual).toBe(expected)

      actual = Util.getIngredIndex(state, 59)
      expected = 1
      expect(actual).toBe(expected)

      actual = Util.getIngredIndex(state, 4)
      // expected = -1
      expect(actual).toBeLessThan(0)
    })

    it('2', () => {
      let state = clone(initialState)
      // state.hasIngreds = true
      state.ingreds.push(i59)  // Notice i59 comes before i57 this time
      state.ingreds.push(i57)
      state.ingredCount = 2

      let actual = Util.getIngredIndex(state, 57)
      let expected = 1
      expect(actual).toBe(expected)

      actual = Util.getIngredIndex(state, 59)
      expected = 0
      expect(actual).toBe(expected)

      actual = Util.getIngredIndex(state, 4)
      // expected = -1
      expect(actual).toBeLessThan(0)
    })
  });

  describe("getMatsFromIngredsList", () => {
    it("Doc example", () => {
      const ingreds = [
        { count: 3, id: 8, data: Mat.ofId(8) },
        { count: 2, id: 66, data: Mat.ofId(66) }
      ]
      const mats = Util.getMatsFromIngredsList(ingreds)
      console.log(mats)
      // => [Mat.ofId(8), Mat.ofId(8), Mat.ofId(8), Mat.ofId(66), Mat.ofId(66)]
    })
  })
})


describe("reductions", () => {
  describe("addItem", () => {
    it("Adding multiple items 1", () => {
      let state = initSt()
      state = redux.addItem(state, { id: 2 })
      state = redux.addItem(state, { id: 27 })
      state = redux.addItem(state, { id: 27 })
      
      expect(exists(state)).toBe(true)
    })
    
    it("Pot number is capped at 5 - 1", () => {
      let st = initSt()
      st = redux.addItem(st, { id: 4 })
      st = redux.addItem(st, { id: 4 })
      st = redux.addItem(st, { id: 4 })
      st = redux.addItem(st, { id: 5 })
      st = redux.addItem(st, { id: 5 })
      expect(st.ingredCount).toBe(5)

      st = redux.addItem(st, { id: 7 })
      expect(st.ingredCount).toBe(5)
      
      st = redux.addItem(st, { id: 4 })
      expect(st.ingredCount).toBe(5)
    })
  });
})