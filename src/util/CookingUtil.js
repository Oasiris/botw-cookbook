// ——————————————————————————————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————————————————————————————

/**
 * C for 'Constants'.
 */
import C from '../data/all.json';
import isNumber from 'isnumber';
import R, { curry, compose, pipe, __ } from 'ramda';

import { exists, xor, match, arrayify, dearrayify, matchK } from './utility';

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

/**
 * Class representing a recipe (abbreviated to avoid a naming conflict with
 * the React component named 'Recipe'.)
 */
export class Rcp {
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
      throw new Error('Don\'t use this constructor; create new Rcps by '
        + 'factory methods `ofName` or `ofId`.');
    }
  }

  /**
   * Factory method for rcps. Returns a newly constructed Rcp object from the
   * specified recipe name.
   * 
   * @param {string} name Recipe's name.
   */
  static ofName(name) {
    const found = R.find(R.propEq('name', name))(C.recipes);
    if (exists(found)) {
      return new Rcp({ ...found, filled: true })
    }
    throw new Error(`Can't create Rcp from name "${name}"`);
  }

  /**
   * Factory method for rcps. Returns a newly constructed Rcp object from the
   * specified material ID.
   * 
   * @param {string|number} id Recipe's ID or index in the records.
   */
  static ofId(id) {
    if (!isNumber(id)) throw new Error(`id "${id}" is NaN`);
    const idAsInteger = parseInt(id, 10);
    const found = R.find(R.propEq('idx', idAsInteger))(C.recipes);
    if (!exists(found)) {
      throw new Error(`Can't create Rcp from id "${idAsInteger}"`);
    }
    return new Rcp({ ...found, filled: true });
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
    const uniqueNuts = 
      compose(R.uniq, R.filter(mat => mat.families.includes('Nut')))(mats).length;
    const justOneNut = uniqueNuts === 1;
    const hasNonNut = R.any(mat => !mat.families.includes('Nut'))(mats);
    bonus += (uniqueNuts === 2) ? 4 : ((justOneNut && hasNonNut) ? 2 : 0);

    // Normal calculation: sum heart bonuses from each item.
    base = R.sum(R.map(m => exists(m.hp) ? m.hp : 0)(mats));
    
    return base + bonus;
  }

  /**
   * @param {*} mats 
   * @return one of the following: 'Dubious', 'Rock-Hard', 'Food', or 'Elixir'.
   */
  static getRecipeType(mats) {
    const DUBIOUS = 'Dubious';
    const ROCK_HARD = 'Rock-Hard';
    const FOOD = 'Food';
    const ELIXIR = 'Elixir';

    // Contains wood or mineral (higher priority than Dubious Food)
    if (R.any(mat => ['Mineral', 'Wood'].includes(mat.type))(mats))
      return ROCK_HARD;
    
    const hasCritter = R.any(R.propEq('usage', 'Critter'))(mats);
    const hasMonsterPart = R.any(R.propEq('usage', 'Monster Part'))(mats);
    // Has monster part(s) but no critter, or vice versa
    if (xor(hasCritter, hasMonsterPart)) {
      return DUBIOUS;
    }
    if (hasCritter && hasMonsterPart) {
      // If no/conflicting effects across ingred., Dubious Food replaces Elixir
      return (CookingUtil.getDishEffect(mats) === 'no effect') ? DUBIOUS : ELIXIR;
    }
    if (!hasCritter && !hasMonsterPart) {
      // If includes a Nutrition ingredient (usage: Food)
      if (R.any(R.propEq('usage', 'Food'))(mats)) {
        return FOOD;
      } else { // If NO Food ingredients (basically, has only additives now)
        const yieldsFood = R.any(__, C.additiveOnlyRecipes)(
          curry(CookingUtil.canCookInto)(mats, __, {})
        );
        return yieldsFood ? FOOD : DUBIOUS; 
      }
    }
  }

  /**
   * @param {Mat[]} mats
   * @return String containing the name of the effect that the recipe made by 
   * cooking these ingredients would yield, or `"no effect"` if there is no net 
   * effect (occurs when there are either 0 or 2+ unique effects across all 
   * input ingredients.)
   */
  static getDishEffect(mats) {
    const uniqueEffects = R.uniq(R.map(R.prop('effect'))(mats));
    return (uniqueEffects.length === 1) ? uniqueEffects[0] : 'no effect';
  }

  /**
   * 
   * @param {Mat[]} mats 
   * @param {Rcp} rcp
   * @param {{ exact?: boolean }} options Options object. The `exact` property 
   *  determines whether or not the materials must exactly match the recipe.
   * @return {boolean} Whether or not the materials could cook into the given
   *  recipe.
   */
  static canCookInto(mats, rcp, options) {
    const { exact } = exists(options) ? options : {};
    const removeOne = R.remove(__, 1, __); // Helper lambdas

    const lessMatsThanRecipe = (mats.length < rcp.ingredients.length);
    const sameMatsAsRecipe = (mats.length === rcp.ingredients.length);
    if (lessMatsThanRecipe || (exact && !sameMatsAsRecipe)) return false;

    const isCopiousRecipe = rcp.uniq_ingred === true;
    if (isCopiousRecipe) {
      const family = R.uniq(isCopiousRecipe)[0][1]; // Food family name
      const isInFamily = mat => mat.familes.includes(family);
      const atLeastLength = arr => arr.length >= rcp.ingredients.length;

      return compose(
        atLeastLength, 
        R.uniq, 
        R.map(R.prop('idx')), 
        R.filter(isInFamily)
      )(mats);
    } 

    // Normal recipes:    
    let fulfillsIngredient = 
    R.curry(
      (mat, ingred) => dearrayify(matchK(mat, ingred)
        // The _ prefix denotes unused arguments
        .on((_mat, [ type, _desc ]) => R.equals(type, 'name'),
            ( mat, [ _type, desc ]) => R.equals(desc, mat.name))
        .on((_mat, [ type, _desc ]) => R.equals(type, 'family'),
            // In this case, desc can be either a string or an array of strings
            ( mat, [ _type, desc ]) => R.any(__, arrayify(desc))
              (d => mat.families.includes(d)))
        .otherwise(() => false))
      );
    mats = R.clone(mats);

    return R.all(__, rcp.ingredients)((ingred) => {
      const matchedMatIdx = R.findIndex(fulfillsIngredient(__, ingred), mats);

        const onMatch = matchedIdx => {
          mats = R.remove(__, 1, mats)(matchedIdx); // Remove element at matchedIdx
          return true;
        };
        const onNoMatch = () => false;
        
        return (matchedMatIdx > -1) ? onMatch(matchedMatIdx) : onNoMatch();
      // });
    });
  }
}

export default class DataUtil {
  
  /**
   * @param {*} effectName Name of an effect. Example: 'Energizing'.
   * @param {*} tierName Name of the effect's tier. Either 'low', 'medium', 
   * or 'high'. Default 'low'.
   * @param {*} rcpType Either 'food' or 'elixir'. Default 'food'.
   * @return {String} Effect-specific recipe description, to be appended to the
   * base recipe description.
   */
  static getEffectDesc(effectName, tierName = 'low', rcpType = 'food') {
    return C.effectDescriptions[effectName.toLowerCase()][rcpType + 'Desc']
      .replace('%s', tierName);
  }

  /**
   * TODO
   * 
   * @param {*} matName The name of the material for which to retrieve a description.
   * @return {String} The description for the material of the given name.
   */
  static getMatDesc(matName) {

  }

  /**
   * TODO
   * 
   * @param {*} rcpName The name of the recipe for which to retrieve a description.
   * @return {String} The base description for the recipe of the given name.
   */
  static getRcpBaseDesc(rcpName) {
    if (!exists(rcpName)) throw new Error('Invalid recipe name: ' + rcpName);
    if (rcpName.includes('Elixir')) return ''; // Elixirs have no base description
    // ...
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
