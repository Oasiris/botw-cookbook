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

import DataUtil from './DataUtil';
import EffectUtil from './EffectUtil';
// module.exports = {};

// ——————————————————————————————————————————————————————————————————————————
// Helpers
// ——————————————————————————————————————————————————————————————————————————


/**
 * Class representing a material.
 * 
 * Abbreviated to avoid a naming conflict with the React component named 
 * 'Material'.
 */
export class Mat {
  /**
   * Constructor.
   * 
   * Meant to be called from factory methods `ofName` and `ofId`.
   * @param {Object} data 
   */
  constructor(data) {
    if (data._filled === true) {
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
      return new Mat({ ...found, _filled: true })
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
    return new Mat({ ...found, _filled: true });
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
    if (data._filled === true) {
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
      return new Rcp({ ...found, _filled: true })
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
    return new Rcp({ ...found, _filled: true });
  }

  /**
   * Returns true if the recipe calls for Monster Extract.
   * @param {Rcp} rcp
   * @return {Boolean} 
   */
  static isMonsterRcp(rcp) {
    return exists(R.find(R.propEq('1', 'Monster Extract'), rcp.ingredients));
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
  static getHpRestore(mats, isHeartyAware = true, usesNutRule = true) {
    /*
     * "Hearty rule": If the effect is Hearty, the dish will provide
     *  full recovery, indicated by a return value of Infinity.
     */
    const hasHeartyEffect = (CookingUtil.getEffect(mats) === 'Hearty');
    if (hasHeartyEffect && isHeartyAware) return Infinity;

    let base = 0,
        bonus = 0;
    /* 
     * "nut bonus" = 4 HP, if the materials include both types of nut
     *             = 2 HP, if the materials include one type of nut
     *                and at least one non-nut materials
     *             = 0, otherwise
     */
    if (usesNutRule) {
      const uniqueNuts = 
        compose(R.uniq, R.filter(mat => mat.families.includes('Nut')))(mats).length;
      const justOneNut = uniqueNuts === 1;
      const hasNonNut = R.any(mat => !mat.families.includes('Nut'))(mats);
      bonus += (uniqueNuts === 2) ? 4 : ((justOneNut && hasNonNut) ? 2 : 0);
    }

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
      return (CookingUtil.getEffect(mats) === 'no effect') ? DUBIOUS : ELIXIR;
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
  static getEffect(mats) {
    // REPLACE SOON
    return EffectUtil.getEffect(mats);
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
    mats = R.uniq(mats);
    const { exact } = exists(options) ? options : {};
    const removeOne = R.remove(__, 1, __); // Helper lambdas

    const lessMatsThanRecipe = (mats.length < rcp.ingredients.length);
    const sameMatsAsRecipe = (mats.length === rcp.ingredients.length);
    if (lessMatsThanRecipe || (exact && !sameMatsAsRecipe)) return false;

    const isCopiousRecipe = rcp.uniq_ingred === true;
    if (isCopiousRecipe) {
      const family = R.uniq(rcp.ingredients)[0][1]; // Food family name
      // if (rcp.name === 'Copious Seafood Skewers') {
      //   console.log(family);
      //   console.log(typeof family);
      //   console.log(rcp.ingredients);
      // }
      const isInFamily = mat => mat.families.includes(family);
      const atLeastLength = arr => arr.length >= rcp.ingredients.length;

      return compose(
        atLeastLength, 
        R.uniq, 
        R.map(R.prop('idx')), 
        R.filter(isInFamily)
      )(mats);
    }

    // Normal recipes:    
    // console.log(mats.map(m => m.name), mats.length);
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

  /**
   * Returns 'no effect' if mats yield no effect.
   * 
   * @param {Mat[]} mats 
   */
  static getDishEffectInfo(mats) {
    const effectName = CookingUtil.getEffect(mats);
    if (effectName === 'no effect') return 'no effect';
    const effectData = C.effectData[effectName.toLowerCase()];
    const { prefix, fxType } = effectData;

    const effContributors = R.filter(R.propEq('effect', effectName))(mats); 
    
    let effectInfo = { prefix, fxType };

    switch(fxType) {
      case 'points':
        const points = compose(
          R.sum,
          R.map(R.prop('potency')),
          R.filter(m => exists(m.potency))
        )(effContributors);
        
        // Bonuses based on effect name
        const potentialBonuses = {
          Hearty:     { extraHearts: points },
          Energizing: { stamina: C.energizingLevels[points] },
          Enduring:   { extraStamina: C.enduringLevels[R.min(points, 20)] }
        };
        effectInfo = { ...effectInfo, points, ...potentialBonuses[effectName] };
        break;
      case 'timed':
        effectInfo = {
          ...effectInfo,
          title: effectData.title,
          ...EffectUtil.calcDishPotency(mats, effectData, {}),
          duration: EffectUtil.getEffectDuration(mats, effectData)
        };
        break;
      default:
        throw new Error(`Invalid fxType ${fxType}`);
    }
    return effectInfo;
  }

  /**
   * @typedef {Object} CookedDish
   * @prop {Rcp} rcp
   * @prop {Mat[]} mats
   * @prop {String} name
   * @prop {String} thumb Local URL string for the dish thumbnail.
   * @prop {String} desc
   * @prop {EffectData} effectData
   * @prop {Number} hpRestore
   * @prop {Number} rupeePrice
   */

  /**
   * @param {Mat[]} mats 
   * @return {CookedDish}
   */
  static cook(mats) {
    mats = arrayify(mats); // In case a Mat was input, instead of a Mat array
    let dish = { mats };
    // Mat validation
    let rcpType = CookingUtil.getRecipeType(mats);
    return match(rcpType)
      .on(R.equals('Elixir'),    () => CookingUtil.cookElixir(mats))
      .on(R.equals('Food'),      () => CookingUtil.cookFood(mats))
      .on(R.equals('Rock-Hard'), () => CookingUtil.cookRockHardFood(mats))
      .on(R.equals('Dubious'),   () => CookingUtil.cookDubiousFood(mats))
      .otherwise(() => {
        throw new Error('cook() error: unknown getRecipeType output');
      });
  }

  /**
   * 
   * @param {*} mats 
   */
  static cookElixir(mats) {
    const effectName = CookingUtil.getEffect(mats); // Will not be 'no effect'

    const rcp = 'Elixir';
    const name = `${effectName} Elixir`;
    const thumb = R.find(R.propEq('name', name), C.elixirs).thumb;
    // const thumb = 'elixir-placeholder.jpg'; // TODO: What to do about elixir thumbs?
    const desc = C.effectDescriptions[effectName.toLowerCase()].elixirDesc;
    const effectData = CookingUtil.getDishEffectInfo(mats);
    const hpRestore  = CookingUtil.getHpRestore(mats);
    const rupeePrice = CookingUtil.getRupeePrice(mats);
    
    return { 
      mats, rcp, name, thumb, desc, effectData, hpRestore, rupeePrice
    };
  }

  /**
   * 
   * @param {*} mats 
   */
  static cookFood(mats) {
    // It's important that the recipes array is traversed in indexed order!!
    const rcpObj = R.find(__, C.recipes)(rcp => CookingUtil.canCookInto(mats, rcp));
    const rcp = Rcp.ofId(rcpObj.idx);
    // Error handle for null rcp here

    let { name, thumb, desc } = rcp;
    const effectData = CookingUtil.getDishEffectInfo(mats);
    let hpRestore = CookingUtil.getHpRestore(mats);
    if (hpRestore !== Infinity) {
      // Accounts for recipes that include bonus hearts or set the # of hearts 
      if (rcp.heartsRestore) {
        hpRestore = rcp.heartsRestore * 4;
      } else if (rcp.heartBonus) {
        hpRestore += rcp.heartBonus * 4;
      // Accounts for Monster _recipes_
      } else if (Rcp.isMonsterRcp(rcp) === true 
        && rcp.heartsAlwaysAffectedByExtract) {
        hpRestore += 3 * 4;
      }
    }
    const rupeePrice = CookingUtil.getRupeePrice(mats);
    
    const effectName = EffectUtil.getEffect(mats);
    if (effectName !== 'no effect') { // If has effect
      name = `${effectName} ${name}`;
      const fxDesc = C.effectDescriptions[effectName.toLowerCase()].foodDesc;
      desc = fxDesc + '\n' + desc;
    }

    return {
      mats, rcp, name, thumb, desc, effectData, hpRestore, rupeePrice
    };
  }

  /**
   * TODO: Test
   * 
   * @param {Mat[]} mats
   * @return {CookedDish} 
   */
  static cookRockHardFood(mats) {
    const rcp = Rcp.ofName('Rock-Hard Food');
    const { name, thumb, desc } = rcp;
    return {
      mats, rcp, name, thumb, desc,
      effectData: 'no effect',
      hpRestore: 1,
      rupeePrice: 2
    };
  }

  /**
   * TODO: Test
   * 
   * @param {Mat[]} mats
   * @return {CookedDish} 
   */
  static cookDubiousFood(mats) {
    // const rcp = Rcp.ofName('Dubious Food');

    // const { name, thumb, desc } = rcp;
    const { name, thumb, desc } = C.dubiousFood;
    const rcp = { name, thumb, desc };
    // const effectData = 'no effect';
    // const hpRestore  = CookingUtil.getHpRestore(mats, false, false) / 2;
    // const rupeePrice = 2;
    return {
      mats, rcp, name, thumb, desc,
      effectData: 'no effect',
      hpRestore:  CookingUtil.getHpRestore(mats, false, false) / 2,
      rupeePrice: 2
    };  
  }
}
