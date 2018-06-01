// ——————————————————————————————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————————————————————————————

/**
 * C for 'Constants'.
 */
import C from '../data/all';
import isNumber from 'isnumber';
import R, { curry, compose, __ } from 'ramda';

import { exists } from './utility';

// module.exports = {};

// ——————————————————————————————————————————————————————————————————————————
// Helpers
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
    const found = R.find(R.propEq('name', name))(C.materials);
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
    const found = R.find(R.propEq('idx', idAsInteger))(C.materials);
    if (!exists(found)) {
      throw new Error(`Can't create Mat from id "${idAsInteger}"`);
    }
    return new Mat({ ...found, filled: true });
  }
}

// ——————————————————————————————————————————————————————————————————————————
// Logic
// ——————————————————————————————————————————————————————————————————————————

export default class CookingUtil {

  /**
   * TODO: Test
   * 
   * @param {Mat[]} mats 
   * @return {number} Numeric price in Rupees.
   */
  static getRupeePrice(mats) {
    // Exception: a recipe of a single acorn sells for 8, oddly enough.
    if (mats.length === 1 && mats[0].name === 'Acorn') return 8;
    // Sum of materials' prices
    const priceSum = compose(R.sum, R.map(R.prop('price')))(mats);
    // Multiplier, which increases w/ number of ingredients in recipe
    const multiplier = C.priceMultipliers[mats.length];
    // Round to highest 10 rupees
    return Math.ceil(priceSum * multiplier / 10) * 10;
  }

  /**
   * @param {Mat[]} mats
   * @return {number} Number of heart pieces (each being 1/4 of a full heart) 
   *   that the cooked material will restore.
   *   Can be Infinity ("Full recovery").
   */
  static getHpRestore(mats) {
    /*
     * "Hearty rule": if materials include any hearty ingredients, they provide
     *  full recovery, indicated by a return value of Infinity.
     */
    const hasHearty = R.any(R.propEq('effect', 'Hearty'))(mats);
    if (hasHearty) return Infinity;

    let base = 0,
        bonus = 0;
    /* 
     * "nut bonus" = 4 HP, if the materials include both types of nut
     *             = 2 HP, if the materials include one type of nut
     *                and at least one non-nut materials
     *             = 0, otherwise
     */
    const uniqueNuts = compose(R.uniq, R.filter(mat => mat.families.includes('Nut')))(mats).length;
    const justOneNut = uniqueNuts === 1;
    const hasNonNut = R.any(mat => !mat.families.includes('Nut'))(mats);
    bonus += (uniqueNuts === 2) ? 4 : ((justOneNut && hasNonNut) ? 2 : 0);

    // Normal calculation: sum heart bonuses from each item.
    base = R.sum(R.map(m => exists(m.hp) ? m.hp : 0)(mats));
    
    return base + bonus;
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
