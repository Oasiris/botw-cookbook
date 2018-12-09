// ——————————————————————————————
// Dependencies
// ——————————————————————————————

/**
 * C for 'Constants'.
 */
// import C from '../data/all.json';
// import isNumber from 'isnumber';
import R, { curry, compose, pipe, __ } from 'ramda';

import { exists, xor, match, arrayify, dearrayify, matchK } from './utility';

import CookingUtil, { Mat, Rcp } from './CookingUtil';

// import DataUtil from './DataUtil';
// import EffectUtil from './EffectUtil';
// module.exports = {};

// ——————————————————————————————
// Classes
// ——————————————————————————————


/**
 * Class representing a Dish.
 */
class Dish { }

/**
 * Class representing a dish cooked in a cooking pot.
 */
export default class CookedDish extends Dish {
  /**
   * Constructor.
   * 
   * Meant to be called from factory methods `ofName` and `ofId`.
   * @param {Object} data 
   */
  constructor(data) {
    super();
    if (data._filled === true) {
      for (let k of R.keys(data)) {
        this[k] = data[k];
      }
    } else {
      throw new Error('Don\'t use this constructor; create new Dishes using ' +
        'factory methods.');
    }
  }

  /**
   * Factory method for a Dish. Returns a new CookedDish based on the input
   * ingredient materials.
   * 
   * @param {Mat[]} mats 
   */
  static ofMats(mats) {
    // Validate mats here
    const dish = CookingUtil.cook(mats);
    return new CookedDish({ ...dish, _filled: true });
  }
}