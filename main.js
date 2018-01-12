// =============================================================================
// - Dependencies --------------------------------------------------------------
// =============================================================================

const R = require('ramda');

const MAT_DICT = require('./data/materials.json');
const RCP_DICT = require('./data/recipes.json');

const additiveRecipeNo = [3, 4, 5, 28, 55, 70, 84, 113];
const XTRA_RCP_DICT = RCP_DICT.filter(r => additiveRecipeNo.includes(Number(r.idx)));

const MAT_DESC_DICT = require('./data/matDesc.json');
const RCP_DESC_DICT = require('./data/recipeDesc.json');

// =============================================================================
// - Global Constants ----------------------------------------------------------
// =============================================================================

const ENERGIZING_LEVELS = [  0, 0.2, 0.4, 0.8, 1.0, 1.4, 1.6, 1.8, 2.2, 2.4, 2.8, 3.0];

// last index is 20. this is the cap
const ENDURING_LEVELS =   [  0, 0.2, 0.2, 0.2, 0.4, 0.4, 0.6, 0.6, 0.8, 0.8, 1.0, 1.0, 1.2, 1.2, 1.4, 1.4, 1.6, 1.6, 1.8, 1.8, 2.0];

const REAGANT_TIERS = [40, 80, 160];

// Source: https://gaming.stackexchange.com/questions/302414/what-are-the-most-profitable-meals-and-elixirs-i-can-cook
const PRICE_MULTIPLIER = [1.5, 1.75, 2.05, 2.4, 2.8];

const EFFECT_DESC = {
  hearty: {
    foodDesc: 'Restores your health and temporarily increases your maximum hearts.',
    elixirDesc: 'Restores you to full health and increases your maximum hearts. The additional hearts are lost as you take damage.'
  }, 
  energizing: {
    foodDesc: 'Instantly refills some of your Stamina Wheel.',
    elixirDesc: 'Restores your Stamina, which is used when performing physical actions such as climbing walls and swimming.'
  },
  enduring: {
    foodDesc: 'Restores and overfills your Stamina Wheel.',
    elixirDesc: 'Restores stamina and temporarily extends your Stamina Wheel. The additional stamina will disappear as it\'s used.'
  },
  sneaky: {
    foodDesc: 'Grants a %s-level stealth boost.',
    elixirDesc: 'Grants a %s-level stealth effect, which calms the nerves and silences footfalls. Allows you to move about undetected by monsters and animals.',
  },
  hasty: {
    foodDesc: 'Grants a %s-level movement-speed boost.',
    elixirDesc: 'Grants a %s-level haste effect, which boosts your movement speed while running, swimming, or climbing.',
  },
  mighty: {
    foodDesc: 'Grants a %s-level attack-power boost.',
    elixirDesc: 'Grants a %s-level might effect, which strengthens your body and mind to boost your attack power with all weapons.',
  },
  tough: {
    foodDesc: 'Grants a %s-level defense boost.',
    elixirDesc: 'Grants a %s-level toughness effect, which fortifies your bones to strengthen your defense. Best to use before facing off against hard-hitting enemies.',
  },
  spicy: {
    foodDesc: 'Grants %s-level cold resistance.',
    elixirDesc: 'Warms your body from its core, increasing your resistance to cold environments. Very useful in the snow-covered mountains.',
  },
  chilly: {
    foodDesc: 'Grants %s-level heat resistance.',
    elixirDesc: 'Grants a %s-level cooling effect, raising your body\'s resistance to heat. Crucial for long journeys through the desert.',
  },
  electro: {
    foodDesc: 'Grants %s-level electricity resistance.',
    elixirDesc: 'Grants a %s-level resistance to electricity. Useful against enemies with electrical attacks.',
  },
  fireproof: {
    foodDesc: '(This should never appear.)',
    elixirDesc: 'Grants a fireproof effect, which prevents your body from catching fire. Be sure to pack this when venturing out to explore Death Mountain.',
  }
};


const MAT_EFFECTS = {
  hearty: {
    prefix: 'Hearty',
    fxType: 'points',
  },
  energizing: {
    prefix: 'Energizing',
    fxType: 'points',
  },
  enduring: {
    prefix: 'Enduring',
    fxType: 'points',
  },
  sneaky: {
    prefix: 'Sneaky',
    fxType: 'timed',
    title: 'Stealth Up',
    fxMD: {
      tierBps: [0, 30, 45], // breakpoints for low, mid, & high
      potencyLevels: [5, 10, 15], // rank 1 mat: 5, rank 2 mat: 10, rank 3 mat: 15
      baseTimeInc: 90, // in seconds
    }
  },
  hasty: {
    prefix: 'Hasty',
    fxType: 'timed',
    title: 'Speed Up',
    fxMD: {
      tierBps: [0, 30], // breakpoints for low & mid
      potencyLevels: [7, 14],
      baseTimeInc: 30, // in seconds
    }
  },
  mighty: {
    prefix: 'Mighty',
    fxType: 'timed',
    title: 'Attack Up',
    fxMD: {
      tierBps: [0, 30, 45], // breakpoints for low, mid, & high
      potencyLevels: [7, 14, 21],  
      baseTimeInc: 20, // in seconds
    }
  },
  tough: {
    prefix: 'Tough',
    fxType: 'timed',
    title: 'Defense Up',
    fxMD: {
      tierBps: [0, 30, 45], // breakpoints for low, mid, & high
      potencyLevels: [7, 14, 21],
      baseTimeInc: 20, // in seconds
    }
  },
  spicy: {
    prefix: 'Spicy',
    fxType: 'timed',
    title: 'Cold Resistance',
    fxMD: {
      tierBps: [0, 30], // breakpoints for low & mid
      potencyLevels: [5, 10, 15],
      baseTimeInc: 120, // in seconds
    }
  },
  chilly: {
    prefix: 'Chilly',
    fxType: 'timed',
    title: 'Heat Resistance',
    fxMD: {
      tierBps: [0, 30], // breakpoints for low & mid
      potencyLevels: [5, 10, 15],
      baseTimeInc: 120, // in seconds
    }
  },
  electro: {
    prefix: 'Electro',
    fxType: 'timed',
    title: 'Shock Resistance',
    fxMD: {
      tierBps: [0, 30, 45], // breakpoints for low & mid
      potencyLevels: [8, 16, 24],
      baseTimeInc: 120, // in seconds
    }
  },
  fireproof: {
    prefix: 'Fireproof',
    fxType: 'timed',
    title: 'Fireproof',
    fxMD: {
      tierBps: [0, 30], // breakpoints for low & mid
      potencyLevels: [4, 9],
      baseTimeInc: 120, // in seconds
    }
  }
};

// =============================================================================
// - Helpers -------------------------------------------------------------------
// =============================================================================

// In: Array<String> or String; JSON
// Out: input type, but as Array<Object> or Object containing the looked up values
// Mapped function: find the material whose property "name" is equal to s
//    from MAT_DICT.

let findData = (arg, dict = MAT_DICT) => {
  if (typeof arg == 'object') {
    let out = R.map(s => R.find(R.propEq('name', s), dict), arg);
    return out;
  } else if (typeof arg == 'string') {
    let out = R.find(R.propEq('name', arg), dict);
    return out;
  }
}
// Abbreviation for 'lookup'
let lm = v => findData(v, MAT_DICT);
let lr = v => findData(v, RCP_DICT);

let findFxData = fxName => MAT_EFFECTS[fxName.toLowerCase()];

let getFxDesc = (fxName, tierName = 'low', rcpType = 'food') => 
  EFFECT_DESC[fxName.toLowerCase()][rcpType + 'Desc'].replace('%s', tierName);

console.log(getFxDesc('Hearty', 'mid', 'elixir'));
console.log(getFxDesc('Tough', 'mid', 'food'));
console.log(getFxDesc('Sneaky', 'high', 'food'));
console.log(getFxDesc('Sneaky', 'low', 'elixir'));
console.log(getFxDesc('Fireproof', 'mid', 'elixir'));


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
 * In: Array of material objects. Assumes the result is not Dubious Food or Rock-Hard Food.
 * Out: Numeric price in rupees. 
 */

function calcRupeePrice(mats) {
  if (mats == ['Acorn']) {  // TODO: see Jason's test for Chickaloo Tree Nut
    return 8;
  }
  let sum = R.sum(mats.map(m => m.price));
  let price = (sum * PRICE_MULTIPLIER[mats.length - 1]); // Unrounded price
  price = Math.ceil(price / 10) * 10;
  return price;
  // console.log(`Sum is ${sum} rupees. Total price is ${price} rupees.`);
}

calcRupeePrice(lm(['Raw Gourmet Meat', 'Raw Gourmet Meat', 'Raw Gourmet Meat', 'Raw Gourmet Meat', 'Raw Gourmet Meat']));
calcRupeePrice(lm(['Chickaloo Tree Nut']));



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

  // let fx = MAT_EFFECTS[fxName.toLowerCase()];
  // let fx = findFxData(fxName);
  fx.fxData = {};
  let fxCausers = mats.filter(R.propEq('effect', fxName));
  // Food
  let foodTimeBoost = mats.filter(m => (m.time_boost != undefined))
    .map(m => m.time_boost)
    .reduce(R.add, 0);

  let reagantTimeBoost = mats.filter(m => m.usage == 'Monster Part')
    .map(m => REAGANT_TIERS[m.rank - 1])
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
        fx.fxData.stm = ENERGIZING_LEVELS[points];
      } else if (fxName == 'Enduring') {
        // Effect maxes out at 20 points
        fx.fxData.xtraStm = ENDURING_LEVELS[R.min(points, 20)];
      }
      break;

    case 'timed':
      console.log('Timed');
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

  console.log(fx);
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

/**
 * In: Non-empty array of material objects that do NOT form into Dubious Food.
 * Out: Number of hearts that the cooked material will restore, OR the String
 * "Full recovery".
 */ 
let getHpHeal = (mats, isHeartyAware = true) => 
  (isHeartyAware && mats.filter(m => m.effect == "Hearty").length != 0) 
    ? "Full recovery" 
    : mats.reduce((sum, m) => sum + m.hp, 0);

// let ex1_getHpHeal = getHpHeal(lm(['Wildberry', 'Hyrule Herb', 'Hyrule Bass', 'Mighty Bananas']));
// console.log(ex1_getHpHeal);
// let ex2_getHpHeal = getHpHeal(lm(['Wildberry', 'Hyrule Herb', 'Hearty Truffle', 'Mighty Bananas']));
// console.log(ex2_getHpHeal);
// let ex3_getHpHeal = getHpHeal(lm(['Armored Carp', 'Armored Carp', 'Ironshell Crab', 'Ironshell Crab']));
// console.log(ex3_getHpHeal);

// Returns all permutations of an array. Meant to be used w/ max 5 values.
function getPermutations(arr = []) {
var permArr = [],
  usedChars = [];

  function permute(input) {
    var i, ch;
    for (let i = 0; i < input.length; i++) {
      ch = input.splice(i, 1)[0];
      usedChars.push(ch);
      if (input.length == 0) {
        permArr.push(usedChars.slice());
      }
      permute(input);
      input.splice(i, 0, ch);
      usedChars.pop();
    }
    return permArr;
  };

  return permute(arr);
}

// let c = getPermutations(['Hearty Durian', 'Hearty Durian', 'Hearty Truffle', 'Hearty Truffle', 'Apple']);
// console.log(R.uniq(c));

// =============================================================================
// - Recipe Functions ----------------------------------------------------------
// =============================================================================

function validateMats(mats) {
  return R.all(R.__, mats)(m => (m !== undefined));
}

// error: no such thing as Hylian Herb, only Hyrule Herb
console.log("> validateMats test (should return false): " + 
  validateMats(lm(['Raw Prime Meat', 'Apple', 'Hylian Herb', 'Bird Egg'])));


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

  // Will return if it matches one of the additive-only recipes
  for (const rcp of XTRA_RCP_DICT) {
    if (canCookInto(rcp, mats, true)) 
      return {type: 'data', data: rcp};
  }
  
  // Must be Dubious Food
  return DUBIOUS;
}


console.log(hasBadMats(lm(['Acorn', 'Apple', 'Bokoblin Horn'])));
console.log(hasBadMats(lm(['Acorn', 'Apple', 'Bokoblin Horn', 'Tireless Frog'])));
console.log(hasBadMats(lm(['Acorn', 'Apple'])));
console.log(hasBadMats(lm(['Acorn'])));
console.log(hasBadMats(lm(['Sugar Cane', 'Monster Extract', 'Tabantha Wheat', 'Goat Butter'])));
console.log(hasBadMats(lm(['Acorn', 'Rock Salt'])));
console.log(hasBadMats(lm(['Hylian Rice'])));



// I NEED TO KNOW WHETHER THIS SHOULD PRINT 'TRUE' OR 'FALSE'
// TOOD: Get Jason's reply
console.log(hasBadMats(lm(['Rock Salt', 'Sugar Cane', 'Monster Extract', 'Tabantha Wheat', 'Goat Butter'])));



function getFoodResult(mats) {
  // TODO: specific optimization.

  for (const rcp of RCP_DICT) {
    if (canCookInto(rcp, mats)) return rcp;
  }
  return null; // Signifies that none of the recipes worked.
  // NOTE: list excludes 
}

console.log(getFoodResult(lm(['Acorn', 'Apple', 'Wildberry'])));
console.log(getFoodResult(lm(['Raw Prime Meat', 'Apple', 'Hyrule Herb', 'Bird Egg'])));
console.log(getFoodResult(lm(['Apple', 'Wildberry', 'Sugar Cane'])));
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
    lm(['Hearty Durian', 'Sugar Cane', 'Apple', 'Tabantha Wheat']))
  );

// =============================================================================
// - Desc Functions ------------------------------------------------------------
// =============================================================================

function getMatDesc(matName) {
  let i = MAT_DESC_DICT.findIndex(m => m[0] == matName);
  if (i !== -1) return MAT_DESC_DICT[i][1];
  return null;
}

console.log(['Apple', 'Acorn', 'Warm Safflina', 'Hearty Bass', 'Big Hearty Radish'].map(m => getMatDesc(m)));

// For foods only -- no elixirs
function getRecipeBaseDesc(rcpName) {
  let i = RCP_DESC_DICT[2].data.findIndex(r => r[0] == rcpName);
  if (i !== -1) return RCP_DESC_DICT[2].data[i][1];
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
  let out = {};
  
  let glance = hasBadMats(mats);
  if (glance.type == 'name') {
    if (glance.data == 'Rock-Hard Food') {
      return ROCK_HARD;
    } else if (glance.data == 'Dubious') {
      out = DUBIOUS;
      out.heal = getHpHeal(mats, false) / 2;
      return out;
    } else {
      let errStr = 'hasBadMats returned result w/ type name, but name isn\'t' +
        'Dubious Food or Rock-Hard Food';
      throw new Error(errStr);
    }
  }

  let fxName = calcFx(mats);
  if (glance.type == 'categ' && glance.data == 'elixir') {
    if (fxName == 'none') {
      out = DUBIOUS;
      out.heal = getHpHeal(mats, false) / 2;
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
      out.fx = getDishEffectDetails(mats, fxName);
      out.desc = getFxDesc(fxName, out.fx.fxData.tierName, 'food') + 
        ' ' + out.name;
    }
  }
  out.price = calcRupeePrice(mats);
  out.matS = matStrings;
  out.heal = getHpHeal(mats);
  return out;
}





// TEST FUNCTION
let TEST_MAT_LISTS = [
  ['Apple'],
  ['Apple', 'Acorn', 'Warm Safflina', 'Hearty Bass', 'Big Hearty Radish'],
  []

]

console.log(cook(['Apple']));

// cook(['Hearty Durian', 'Apple', 'Apple', 'Bird Egg', 'Rock Salt']);
// cook(['Fresh Milk', 'Sugar Cane']);
// cook(['Hearty Durian', 'Hearty Truffle']);

