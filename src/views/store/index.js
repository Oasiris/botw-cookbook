import { createStore } from 'redux'
import { any, __, range, zip, filter } from 'ramda'

import { Mat, Rcp } from '../../scripts/CookingUtil'
import { exists } from '../../scripts/utility';

// Initial State
export const initialState = {
  ingreds: [],
  hasIngreds: false,
  dish: null,
  hasDish: false
}

// Helpers
export class Util {
  // /**
  //  * @return {Boolean} Whether or not the state holds the ingredient of the
  //  * specified ID.
  //  */
  // static hasIngred(state, itemId) {
  //   console.log(state.ingreds)
  //   console.log(any(__, state.ingreds)(ingred => ingred.id === itemId))

  //   let bool = 
  //     (state.hasIngreds && any(__, state.ingreds)(ingd => ingd.id === itemId))
  //   return bool;
  // }

  /**
   * @return {Number} The index of the ingredient in state.ingred that matches
   *  the specified itemId, or 0 if none was found.
   */
  static getIngredIndex(state, itemId) {
    if (!state.hasIngreds) return -1;

    const results = 
      filter(__, zip(state.ingreds, range(0, state.ingreds.length)))
        (([ingred, idx]) => ingred.id === itemId)
    
    const out = (results.length) ? results[0][1] : -1;
    return out;
  }
}


const reductions = {
  /**
   * Adds item to state. 
   * 
   * If the ingredient is already in the `ingred` list with a non-zero count,
   *  increments the count.
   * Otherwise, adds it to the list with a count of 1.
   */
  addItem: (st, { id }) => {
    // Make sure the id exists
    if (!exists(id)) return st
    // TODO: Make sure the item exists

    // Check if we have that ingredient already
    const ingredIdx = Util.getIngredIndex(st, id);
    if (ingredIdx === -1) {
      // If not, create and add it
      let newIngred = {
        count: 1,
        id: id,
        data: Mat.ofId(id)
      }
      st.ingreds.push(newIngred)

    } else {  // Already have it --> find ele in array, increment by one
      let ele = st.ingreds[ingredIdx];
      ele.count++;
    }

    st.hasIngreds = true;
    return st;
  },

  /**
   * 
   */
  removeItem: (st, { id }) => {
    // Make sure the id exists
    if (!exists(id)) return st;

    // Make sure the ingred is in the list
    const idx = Util.getIngredIndex(st, id)
    if (idx === -1) return st;

    // Decrement that item's count
    const target = st.ingreds[idx]
    target.count--;
    if (target.count === 0) {  // If that was the only one, remove from list
      st.ingreds.splice(idx, 1);
    }
    if (st.ingreds.length === 0) {  // If list is empty, set hasIngreds to false
      st.hasIngreds = false;
    }

    return st;
  },

  /**
   * 
   */
  purgeItem: (st, { id }) => {
    // Make sure the id exists
    if (!exists(id)) return st;

    // Make sure the ingred is in the list
    const idx = Util.getIngredIndex(st, id)
    if (idx === -1) return st;

    // Remove that item
    // Decrement that item's count
    st.ingreds.splice(idx, 1);
    if (st.ingreds.length === 0) {  // If list is empty, set hasIngreds to false
      st.hasIngreds = false;
    }

    return st;
  },

  /**
   * 
   */
  emptyPot: (st) => {
    st.ingreds = [];
    st.hasIngreds = false;
    return st;
  }


}



const reducer = (state = initialState, action) => {
  console.log('reducer', action)
  let st = Object.assign({}, state)
  // const handleError = () => st;

  switch(action.type) {
    case 'Add Item':
      return reductions.addItem(st, action);
    case 'Remove Item':
      return reductions.removeItem(st, action);
    case 'Purge Item':
      return reductions.purgeItem(st, action);
    case 'Empty Pot':
      return reductions.emptyPot(st);
    default:
      return state
  }
}

const store = createStore(reducer)
export default store