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
// const hasIngred = (state, itemId) => {
// }

const reductions = {
  /**
   * 
   */
  addItem: (st, { id }) => {
    // Make sure the id exists
    if (!exists(id)) return st;
    // TODO: Make sure the item exists

    // Check if we have that ingredient already
    let ingredIdx = Util.getIngredIndex(st, id);
    if (ingredIdx === -1) {
      // If not, create and add it
      let newIngred = {
        count: 1,
        id: id,
        data: Mat.ofId(id)
      }
      st.ingreds.push(newIngred)

    } else {  // Already have it
      // ...find element of array, increment it by one...
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

    return st;
  },

  /**
   * 
   */
  purgeItem: (st, { id }) => {
    // TODO
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
    default:
      return state
  }
  
}

const store = createStore(reducer)
export default store