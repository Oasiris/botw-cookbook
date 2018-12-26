/**
 * Contains:
 * 
 *  - Initial state.
 *  - Reduction helper functions.
 *  - Reducer.
 *  - Store (which is simply `store = createStore(reducer)`.)
 */

import { createStore } from 'redux'
import { any, __, range, zip, filter, clone } from 'ramda'

import { Mat, Rcp } from '../../scripts/CookingUtil'
import CookedDish from '../../scripts/CookedDish'
import { exists } from '../../scripts/utility';

// Initial State
export const initialState = {
  ingreds: [],
  // hasIngreds: false,
  ingredCount: 0,
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
   *  the specified itemId, or a negative number if none was found.
   * 
   * Returns -1 if there are no ingredients, and -2 if there are ingredients
   * but none matched the ID.
   */
  static getIngredIndex(state, itemId) {
    if (!state.ingredCount) {
      return -1;
    }

    const results =
      filter(__, zip(state.ingreds, range(0, state.ingreds.length)))
        (([ingred, idx]) => ingred.id === itemId)

    const out = (results.length) ? results[0][1] : -2;
    return out;
  }

  /**
   * @return {Number} The number of ingredients in the pot.
   */
  static getCount(state) {
    if (!state.ingredCount) return 0;
    return state.ingreds.reduce((count, ing) => count + ing.count, 0)
  }

  /**
   * Unpacks the ingreds list into a list of material objects.
   * 
   * @param {Array} ingreds Ingreds. Should be non-empty.
   * @return API-friendly list of material objects.
   * @example
   * 
   *  const ingreds = [
   *    { count: 3, id: 8, data: Mat.ofId(8) },
   *    { count: 2, id: 66, data: Mat.ofId(66) }
   *  ]
   *  const mats = unpackIngredsList(ingreds)
   *  console.log(mats)
   *  // => [Mat.ofId(8), Mat.ofId(8), Mat.ofId(8), Mat.ofId(66), Mat.ofId(66)]
   */
  static getMatsFromIngredsList(ingreds) {
    let mats = []
    ingreds.forEach(ing => {
      // Append the material data {ing.count} times
      range(0, ing.count).forEach(() => mats.push(ing.data))
    })
    return mats
  }

}

const reductions = {
  /**
   * Adds item to state. 
   * 
   * If the ingredient is already in the `ingred` list with a non-zero count,
   *  increments the count.
   * Otherwise, adds it to the list with a count of 1.
   * 
   * Can't add more than 5 items.
   */
  addItem: (st, { id }) => {
    // Make sure the id exists
    if (!exists(id)) return st
    // TODO: Make sure the item exists

    // If total count is above 5
    if (st.ingredCount > 5) throw new Error("More than 5 ingreds");
    if (st.ingredCount === 5) return st 

    // Check if we have that ingredient already
    const ingredIdx = Util.getIngredIndex(st, id);
    if (ingredIdx < 0) {
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

    // st.hasIngreds = true;
    st.ingredCount++;
    console.log(st.ingreds)
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
    // if (st.ingreds.length === 0) {  // If list is empty, set hasIngreds to false
    //   st.hasIngreds = false;
    // }

    st.ingredCount--;
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
    // if (st.ingreds.length === 0) {  // If list is empty, set hasIngreds to false
    //   st.hasIngreds = false;
    // }
    // Recount ingredCount
    st.ingredCount = Util.getCount(st);

    return st;
  },

  /**
   * 
   */
  emptyPot: (st) => {
    const initSt = clone(initialState);
    const { ingreds, ingredCount } = initSt;
    const out = { ...st, ingreds, ingredCount };
    console.log(out)
    return out;
  },

  /**
   * 
   * @param {Boolean} keepPot -- If true, the ingredients in the pot are
   *  unmodified. If false, the ingredients in the pot are wiped.
   */
  cook: (st, { keepPot }) => {
    if (st.ingredCount) {
      const mats = Util.getMatsFromIngredsList(st.ingreds)
      const dish = CookedDish.ofMats(mats)
      const hasDish = true
      st = { ...st, dish, hasDish }
      console.log(st.dish)
    }
    if (keepPot === false) {
      st = reductions.emptyPot(st)
    }
    return st;


    
    // if (!st.ingredCount) {
      // // QUESTION: Do we want to wipe the pot? Or keep whatever was in it?
      // return st;
    // }
  }


}
export { reductions }



const reducer = (state = initialState, action) => {
  console.log('reducer', action)
  // let st = Object.assign({}, state)
  let st = clone(state)
  // const handleError = () => st;

  switch (action.type) {
    case 'Add Item':
      return reductions.addItem(st, action);
    case 'Remove Item':
      return reductions.removeItem(st, action);
    case 'Purge Item':
      return reductions.purgeItem(st, action);
    case 'Empty Pot':
      return reductions.emptyPot(st);
    case 'Cook':
      return reductions.cook(st, action);
    default:
      return state
  }
}

const store = createStore(reducer)
export default store