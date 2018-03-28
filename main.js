// =============================================================================
// - Dependencies --------------------------------------------------------------
// =============================================================================

const R = require('ramda');

// =============================================================================
// - Global Constants ----------------------------------------------------------
// =============================================================================

const C = require('./constants');

// =============================================================================
// - Base Helpers --------------------------------------------------------------
// =============================================================================

let makeProperN = s => s
  .split(' ')
  .map(s => s.length > 0 ? s[0].toUpperCase() + s.slice(1) : s)
  .join(' ');

// In: Array<String> or String; JSON
// Out: corresponding Array<Object> or Object containing the looked up values
// Mapped function: find the material whose property "name" is equal to s
//    from C.matDict.

let findData = (arg, dict = C.matDict) => {
  if (typeof arg == 'object') {
    let out = R.map(s => R.find(R.propEq('name', makeProperN(s)), dict), arg);
    return out;
  } else if (typeof arg == 'string') {
    let out = R.find(R.propEq('name', makeProperN(arg)), dict);
    return out;
  }
}

// Abbreviation for 'lookup'
let lm = v => findData(v, C.matDict);
let lr = v => findData(v, C.rcpDict);


// =============================================================================
// - Misc. Helpers -------------------------------------------------------------
// =============================================================================

/**
 * In: Array of material objects. Assumes the result is not Dubious Food 
 *       or Rock-Hard Food.
 * Out: Numeric price in rupees. 
 */

function calcRupeePrice(mats) {
  if (mats.length == 1 && mats[0].name == 'Acorn') {
    return 8;
  }
  let sum = R.sum(mats.map(m => m.price));
  let price = (sum * C.priceMultiplier[mats.length - 1]); // Unrounded price
  price = Math.ceil(price / 10) * 10;
  return price;
  // console.log(`Sum is ${sum} rupees. Total price is ${price} rupees.`);
}

/**
 * In: Non-empty array of material objects that do NOT form into Dubious Food.
 * Out: Number of hearts that the cooked material will restore, OR the String
 * "Full recovery".
 */ 
let getHpHeal = (mats, isHeartyAware = true, usesNutRule = true) => {
  let out = 0;
  // "The Nut Rule"
  // +2HP if nut is present & there are ingredients present other than that nut
  if (usesNutRule) {
    for (let nut of ['Acorn', 'Chickaloo Tree Nut']) {
      if (R.any(m => m.name == nut)(mats) && 
         (mats.filter(m => m.name != nut).length > 0)) {
        out += 2;
      }
    }
  }
  
  // Main heart calc
  out += (isHeartyAware && mats.filter(m => m.fx == "Hearty").length != 0) 
    ? "Full recovery" 
    : mats.reduce((sum, m) => sum + m.hp, 0);
  return out; 
}


// Boolean function
function validateMats(mats) {
  return R.all(R.__, mats)(m => (m !== undefined));
}

// error: no such thing as Hylian Herb, only Hyrule Herb
console.log("> validateMats test (should return false): " + 
  validateMats(lm(['Raw Prime Meat', 'Apple', 'Hylian Herb', 'Bird Egg'])));

// =============================================================================
// - Effect (FX) Helpers -------------------------------------------------------
// =============================================================================

let findFxData = fxName => C.matFx[fxName.toLowerCase()];

let getFxDesc = (fxName, tierName = 'low', rcpType = 'food') => 
  C.fxDesc[fxName.toLowerCase()][rcpType + 'Desc'].replace('%s', tierName);

// In: Array<Object> of material objects
// Out: String representing the name of the effect to be used
// Could use some reworking

function calcFx(mats) {
  let fx = R.uniq(mats.map(m => m.effect)); // Get list of effects
  fx = fx.filter(el => (el));  // Filters out null/undefined/false/0
  if (fx.length == 1) return fx[0]; // If exactly one effect type, return it
  return "none";  // If zero effect types/clashing effect types, return none
}

/**
 * In: Non-empty array of material objects, all w/ no effect or same effect;
 *         name of effect, if exists.
 * Out: (insert some properties of the thing here)
 */ 

function getDishEffectDetails(
    mats, 
    fxName = calcFx(mats), 
    fx = findFxData(fxName)) {

  if (fxName == 'none') return null;

  fx.fxData = {};
  let fxCausers = mats.filter(R.propEq('effect', fxName));
  // Food
  let foodTimeBoost = mats.filter(m => (m.time_boost != undefined))
    .map(m => m.time_boost)
    .reduce(R.add, 0);

  let reagantTimeBoost = mats.filter(m => m.usage == 'Monster Part')
    .map(m => C.reagantTiers[m.rank - 1])
    .reduce(R.add, 0);


  switch(fx.fxType) {
    case 'points':
      let points = fxCausers.reduce(
        (sum, m) => (m.potency) ? sum + m.potency : sum
        , 0);
      fx.fxData.points = points;
      if (fxName == 'Hearty') {
        fx.fxData.xtraHearts = points;
      } else if (fxName == 'Energizing') {
        fx.fxData.stm = C.energizingLvls[points];
      } else if (fxName == 'Enduring') {
        // Effect maxes out at 20 points
        fx.fxData.xtraStm = C.enduringLvls[R.min(points, 20)];
      }
      break;

    case 'timed':
      // console.log('Timed');
      fx.fxMD.totPotency = fxCausers.reduce((sum, m) => 
          (m.potency) ? sum + fx.fxMD.potencyLevels[m.potency - 1] : sum
          , 0);
      let tierNum = getTimedTier(fx.fxMD.totPotency, fx.fxMD.tierBps);
      let tierName = (tierNum == 3) ? 'high' : ((tierNum == 2) ? 'mid' : 'low');
      fx.fxData.tierNumber = tierNum;
      fx.fxData.tierName = tierName;
      fx.fxData.time = (30*mats.length) + (fx.fxMD.baseTimeInc*fxCausers.length);
      fx.fxData.time += foodTimeBoost + reagantTimeBoost;
      break;

    default:
      throw new Error('effect with type other than "timed" or "points"');
  } // end of switch statement

  // console.log(fx);
  return fx;
}

getDishEffectDetails(lm(['Hearty Durian', 'Hearty Durian', 'Hearty Truffle', 'Hearty Truffle', 'Apple']));
getDishEffectDetails(lm(['Hearty Durian', 'Hearty Durian', 'Hearty Truffle', 'Hearty Truffle', 'Hearty Truffle']));
getDishEffectDetails(lm(['Fleet-Lotus Seeds', 'Fleet-Lotus Seeds']));
getDishEffectDetails(lm(['Fleet-Lotus Seeds', 'Fleet-Lotus Seeds', 'Fleet-Lotus Seeds', 'Fleet-Lotus Seeds']));
getDishEffectDetails(lm(['Fleet-Lotus Seeds', 'Rushroom', 'Fleet-Lotus Seeds']));
getDishEffectDetails(lm(['Fleet-Lotus Seeds', 'Rushroom', 'Mighty Bananas']));
getDishEffectDetails(lm(['Spicy Pepper', 'Spicy Pepper', 'Sunshroom', 'Sizzlefin Trout']));
getDishEffectDetails(lm(['Hightail Lizard', 'Bokoblin Fang', 'Keese Wing']));
getDishEffectDetails(lm(['Electric Darner', 'Electric Darner', 'Lizalfos Horn']));

function getTimedTier(potency, tiers) {
  if (tiers[2] && potency > tiers[2]) {
    return 3;
  } else if (tiers[1] && potency > tiers[1]) {
    return 2;
  } else if (potency > tiers[0]) {
    return 1;
  } else {
    console.error("Something went wrong (getTimedTier)");
  }
}

// =============================================================================
// - Recipe Functions ----------------------------------------------------------
// =============================================================================

/**
 * IN: Array of material objects
 * OUT: Three output types:
 *   - { type: 'name',  data: <<insert name of dish here>> }
 *   - { type: 'categ', data: <<either 'food' or 'elixir'>> }
 *   - { type: 'data',  data: <<insert full recipe object here>> }
 *
 * Note: Dubious Food and Rock-Hard Food always sell for 2 rupees
 */
function hasBadMats(mats) {
  const ROCK_HARD = {type: 'name',  data: 'Rock-Hard Food'};
  const DUBIOUS   = {type: 'name',  data: 'Dubious Food'};
  const FOOD      = {type: 'categ', data: 'food'};
  const ELIXIR    = {type: 'categ', data: 'elixir'};


  // Contains wood or mineral (higher priority than Dubious Food)
  if (mats.filter(m => ['Mineral', 'Wood'].includes(m.type)).length > 0)
    return ROCK_HARD;

  // Has monster part(s) but no critter, or vice versa
  let e = 0;
  if (mats.filter(R.propEq('usage', 'Critter')).length > 0)
    e++;
  if (mats.filter(R.propEq('usage', 'Monster Part')).length > 0)
    e++;
  if (e == 1) return DUBIOUS;

  // Has monster part + critter, but ingredients have conflicting effects
  if (e == 2) {
    // calcFx returns 'none' if NO effect OR conflicting effect, but since
    //   all critters have an effect, we know 'none' == conflicting effect.
    if (calcFx(mats) == 'none') {
      return DUBIOUS;
    } else {
      // If it has a monster part + critter and produces a valid effect,
      //   it passes, even if it has bad seasoning combos.
      return ELIXIR;
    }
  }

  // Materials are fine + has a Nutrition ingredient
  if (mats.findIndex(R.propEq('usage', 'Food')) !== -1)
    return FOOD;
 
  // Combos hereon out: no monster parts, critters, minerals, wood, or food. 
  // All combos from hereon have _only_ additives.

  // console.log('Additive-only mats');

  // Will return if it matches one of the additive-only recipes
  for (const rcp of C.xtraRcpDict) {
    if (canCookInto(rcp, mats)) {  // Monster extract dishes don't need to be exact
      if (rcp.name.indexOf('Monster') !== -1) {
        return {type: 'data', data: rcp};
      } else {
        if (canCookInto(rcp, mats, true)) {  // All others do
          return {type: 'data', data: rcp};
        }
      }
    }
  }
  
  // Must be Dubious Food
  return DUBIOUS;
}

console.log(hasBadMats(lm(['Acorn', 'Apple', 'Bokoblin Horn'])));
console.log(hasBadMats(lm(['Acorn', 'Apple', 'Bokoblin Horn', 'Tireless Frog'])));
console.log(hasBadMats(lm(['Acorn', 'Apple'])));
console.log(hasBadMats(lm(['Acorn'])));
console.log(hasBadMats(lm(['Cane Sugar', 'Monster Extract', 'Tabantha Wheat', 'Goat Butter'])));
console.log(hasBadMats(lm(['Acorn', 'Rock Salt'])));
console.log(hasBadMats(lm(['Hylian Rice'])));

// I NEED TO KNOW WHETHER THIS SHOULD PRINT 'TRUE' OR 'FALSE'
// TOOD: Get Jason's reply
console.log(hasBadMats(lm(['Rock Salt', 'Cane Sugar', 'Monster Extract', 'Tabantha Wheat', 'Goat Butter'])));

function getFoodResult(mats) {
  // TODO: specific optimization.

  for (const rcp of C.rcpDict) {
    if (canCookInto(rcp, mats)) return rcp;
  }
  return null; // Signifies that none of the recipes worked.
}

console.log(getFoodResult(lm(['Acorn', 'Apple', 'Wildberry'])));
console.log(getFoodResult(lm(['Raw Prime Meat', 'Apple', 'Hyrule Herb', 'Bird Egg'])));
console.log(getFoodResult(lm(['Apple', 'Wildberry', 'Cane Sugar'])));
console.log(getFoodResult(lm(['Apple', 'Wildberry', 'Hearty Durian', 'Spicy Pepper'])));
console.log(getFoodResult(lm(['Apple', 'Spicy Pepper', 'Hearty Durian', 'Spicy Pepper'])));

// In: Recipe obj, Array of material obj
// Out: Boolean

function canCookInto(rcp, mats, mustBeExact = false) {
  // If mats has less # than recipe calls for
  if (mats.length < rcp.ingredients.length) {
    return false; 
  } else if (mustBeExact && mats.length !== rcp.ingredients.length) {
    return false;
  }

  let ms = R.clone(mats);
  // If recipe is one of the 'Copious'
  if (rcp.uniq_ingred) {
    let usedMatName = [];
    return R.all(R.__, rcp.ingredients)(el => {
      // we know that it's family
      let sIdx = ms.findIndex(m => 
        (m.families.includes(el[1]) && !usedMatName.includes(m.name)));
      if (sIdx == -1) {
        return false;
      }
      usedMatName.push(ms[sIdx].name);
      ms = ms.slice(0, sIdx).concat(ms.slice(sIdx + 1));
      return true;
    });
  }

  // If normal recipe
  return R.all(R.__, rcp.ingredients)(el => {
    let sIdx;
    switch(el[0]) {
      case 'name':
        sIdx = ms.findIndex(m => m.name == el[1]);
        break;
      case 'family':
        sIdx = ms.findIndex(m => m.families.includes(el[1]));
        break;
      default:
        sIdx = -1;
        let errStr = 'canCookInto unexpected error: ingredient in' +
          'recipes.json has categ in 0th index other than name or family';
        throw new Error(errStr);
    }

    if (sIdx == -1) {
      return false;
    }

    ms = ms.slice(0, sIdx).concat(ms.slice(sIdx + 1));
    return true;
  }); // end of R.all
}

console.log(
  '> canCookInto Tests:',
  '\nT 1 output (expect true):',
  canCookInto(
    lr('Clam Chowder'), 
    lm(['Fresh Milk', 'Tabantha Wheat', 'Goat Butter', 'Hearty Blueshell Snail'])),
  '\nT 2 output (expect true):',
  canCookInto(
    lr('Prime Meat Stew'), 
    lm(['Goat Butter', 'Fresh Milk', 'Raw Bird Thigh', 'Tabantha Wheat'])),
  '\nT 3 output (expect false):',
  canCookInto(
    lr('Prime Meat Stew'), 
    lm(['Goat Butter', 'Apple', 'Fresh Milk', 'Raw Gourmet Meat', 'Tabantha Wheat'])),
  '\nT 4 output (expect true):',
  canCookInto(
    lr('Fruitcake'), 
    lm(['Hearty Durian', 'Cane Sugar', 'Apple', 'Tabantha Wheat']))
  );

// =============================================================================
// - Desc Functions ------------------------------------------------------------
// =============================================================================

function getMatDesc(matName) {
  let i = C.matDescDict.findIndex(m => m[0] == matName);
  if (i !== -1) return C.matDescDict[i][1];
  return null;
}

console.log(['Apple', 'Acorn', 'Warm Safflina', 'Hearty Bass', 'Big Hearty Radish'].map(m => getMatDesc(m)));

// For foods only -- no elixirs
function getRecipeBaseDesc(rcpName) {
  let i = C.rcpDescDict[2].data.findIndex(r => r[0] == rcpName);
  if (i !== -1) return C.rcpDescDict[2].data[i][1];
  return null;
}

console.log(['Fruitcake', 'Monster Soup', 'Copious Simmered Fruit', 'Honey Candy', 'Rock-Hard Food', 'Dubious Food'].map(r => getRecipeBaseDesc(r)));

// =============================================================================
// - Functions -----------------------------------------------------------------
// =============================================================================





// Main function
// In: an array of up to 5 strings representing material objects
// Out: a recipe object





function cook(matStrings) {
  if (matStrings.length == 0) {
    return {};
  }

  const ROCK_HARD = {
    name: 'Rock-Hard Food',
    description: getRecipeBaseDesc('Rock-Hard Food'),
    price: 2,
    price_mon: null,
    matS: matStrings,
    heal: 1,
    fx: null
  };
  let DUBIOUS = {
    name: 'Dubious Food',
    description: getRecipeBaseDesc('Dubious Food'),
    price: 2,
    price_mon: null,
    matS: matStrings,
    heal: undefined,
    fx: null
  };
  let mats = lm(matStrings);
  if (!validateMats(mats)) throw new Error(`Invalid mats: ${matStrings}`);
  let out = {};
  
  let glance = hasBadMats(mats);
  if (glance.type == 'name') {
    if (glance.data == 'Rock-Hard Food') {
      return ROCK_HARD;
    } else if (glance.data == 'Dubious Food') {
      out = DUBIOUS;
      out.heal = getHpHeal(mats, false, false) / 2;
      return out;
    } else {
      // console.log(glance);
      let errStr = 'hasBadMats returned result w/ type name, but name isn\'t ' +
        'Dubious Food or Rock-Hard Food';
      throw new Error(errStr);
    }
  }

  let fxName = calcFx(mats);
  if (glance.type == 'categ' && glance.data == 'elixir') {
    if (fxName == 'none') {
      out = DUBIOUS;
      out.heal = getHpHeal(mats, false, false) / 2;
      return out;
    } else {
      out.name = `${fxName} Elixir`;
      out.fx = getDishEffectDetails(mats, fxName);
      // If no tier name, it ends up working out ok anyway
      out.desc = getFxDesc(fxName, out.fx.fxData.tierName, 'elixir');
    }
  } else {
    let recipeData = (glance.type == 'data') ? glance.data : getFoodResult(mats);
    out.name = recipeData.name;
    out.desc = getRecipeBaseDesc(out.name);
    if (fxName !== 'none') {
      console.log(fxName);
      out.fx = getDishEffectDetails(mats, fxName);
      out.name = out.fx.prefix + ' ' + out.name;
      out.desc = getFxDesc(fxName, out.fx.fxData.tierName, 'food') + 
        ' ' + out.desc;
    }
  }
  out.price = calcRupeePrice(mats);
  out.matS = matStrings;
  out.heal = getHpHeal(mats, false);
  if (out.fx && out.fx.prefix == 'Hearty') out.heal = 'Full recovery';
  return out;
}





// TEST FUNCTION
let TEST_MAT_LISTS = [
  ['Apple'],
  ['Hightail Lizard'],
  ['Apple', 'Acorn', 'Warm Safflina', 'Hearty Bass', 'Hearty Radish'],
  ['Acorn', 'Hearty Bass', 'Hearty Truffle', 'Big Hearty Radish', 'Hylian Rice'],
  ['Rock Salt', 'Cane Sugar', 'Monster Extract', 'Tabantha Wheat', 'Goat Butter']

]

TEST_MAT_LISTS.forEach(e => console.log(cook(e)));


// console.log(cook(['Apple']));

// cook(['Hearty Durian', 'Apple', 'Apple', 'Bird Egg', 'Rock Salt']);
// cook(['Fresh Milk', 'Cane Sugar']);
// cook(['Hearty Durian', 'Hearty Truffle']);

module.exports = {
  makeProperN, lm, lr, 
  calcRupeePrice, getHpHeal, validateMats, 
  findFxData, getFxDesc, calcFx, getDishEffectDetails, getTimedTier, 
  hasBadMats, canCookInto, 
  getMatDesc, getRecipeBaseDesc, 
  cook
};