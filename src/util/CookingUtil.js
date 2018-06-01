// ——————————————————————————————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————————————————————————————

import data from '../data/all';
import isNumber from 'isnumber';
import R, { curry, compose, __ } from 'ramda';

// module.exports = {};

// ——————————————————————————————————————————————————————————————————————————
// Helpers
// ——————————————————————————————————————————————————————————————————————————

function exists(x) {
  return (x !== undefined) && (x !== null);
}

// ——————————————————————————————————————————————————————————————————————————
// Logic
// ——————————————————————————————————————————————————————————————————————————

/**
 * Class representing a material (abbreviated to avoid a naming conflict with
 * the React component named 'Material'.)
 */
export class Mat {

  /**
   * Constructor.
   * 
   * Meant to be called from factory methods `ofName` and `ofId`.
   * @param {Object} data 
   */
  constructor(data) {
    if (data.filled === true) {
      for (let k of R.keys(data)) {
        this[k] = data[k];
      }
    } else {
      throw new Error('Don\'t use this constructor; create new Mats by ' 
        + 'factory methods `ofName` or `ofId`.');
    }
  }

  /**
   * Factory method for mats. Returns a newly constructed Mat object from the
   * specified material name.
   * 
   * @param {string} name Material's name.
   */
  static ofName(name) {
    const found = R.find(R.propEq('name', name))(data.materials);
    if (exists(found)) {
      return new Mat({ ...found, filled: true })
    }
    throw new Error(`Can't create Mat from name "${name}"`);
  }

  /**
   * Factory method for mats. Returns a newly constructed Mat object from the
   * specified material ID.
   * 
   * @param {string|number} id Material's ID or index in the records.
   */
  static ofId(id) {
    if (!isNumber(id)) throw new Error(`id "${id}" is NaN`);
    const idAsInteger = parseInt(id, 10);
    const found = R.find(R.propEq('idx', idAsInteger))(data.materials);
    if (!exists(found)) {
      throw new Error(`Can't create Mat from id "${idAsInteger}"`);
    }
    return new Mat({ ...found, filled: true });
  }
}

export default class CookingUtil {

  /**
   * 
   * @param {Material[]} mats 
   * @return {number} Numeric price in Rupees.
   */
  static getRupeePrice(mats) {
    if (mats.length === 1 && mats[0].name === 'Acorn') return 8;
    // let sum = 
    let sum = compose(R.sum, R.map(R.prop('a')), mats);
    console.log(sum);
  }
}

// /**
//  * 
//  * @param {Material[]} mats 
//  * @return {number} Numeric price in Rupees.
//  */
// module.exports.getRupeePrice = mats => {
  

// }

// ——————————————————————————————————————————————————————————————————————————
// Exporting
// ——————————————————————————————————————————————————————————————————————————
