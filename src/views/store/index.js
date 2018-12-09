import { createStore } from 'redux'
import { any, __ } from 'ramda'

// Initial State
export const initialState = {
  ingreds: [],
  hasIngreds: false,
  dish: null,
  hasDish: false
}

// Helpers
export class Util {
  static hasIngred(state, itemId) {
    return state.hasIngreds && any(__, state.ingreds)(item => item.id === itemId)
  }
}
// const hasIngred = (state, itemId) => {
// }

const reductions = {
  addItem: (st, { itemId }) => {
    // Check if we have that ingredient already
    if (!Util.hasIngred(st, itemId)) {
      // If not, create and add it
      let newIngred = {
        count: 1,
        id: itemId,
        data: null
      }


    }

  }
}



const reducer = (state = initialState, action) => {
  console.log('reducer', action)
  const st = Object.assign({}, state)
  switch(action.type) {
    case 'Add Item':
      return { ...st }
    default:
      return state
  }
  
}

const store = createStore(reducer)
export default store