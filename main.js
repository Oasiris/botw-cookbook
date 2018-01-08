// =============================================================================
// - Dependencies --------------------------------------------------------------
// =============================================================================

const R = require('ramda');

const materialsList = require('./materials.json');
const recipeList = require('./recipes.json');

const additiveRecipeNo = [3, 4, 5, 28, 55, 70, 84, 113];
const additiveOnlyRecipes = recipeList.filter(r => additiveRecipeNo.includes(Number(r.idx)));

console.log(additiveOnlyRecipes);

// =============================================================================
// - Global Constants ----------------------------------------------------------
// =============================================================================

const REAGANT_TIERS = [40, 80, 160];

// Source: https://gaming.stackexchange.com/questions/302414/what-are-the-most-profitable-meals-and-elixirs-i-can-cook
const PRICE_MULTIPLIER = [1.5, 1.75, 2.05, 2.4, 2.8];

const ICONS = {
  hearty: '...',
  energizing: '...',
  enduring: '...',
  sneaky: '...',
  hasty: '...',
  mighty: '...',
  tough: '...',
  spicy: '...',
  chilly: '...',
  electro: '...',
  fireproof: '...'
  // ... finish this soon
};

const MAT_EFFECTS = {
  hearty: {
    prefix: 'Hearty',
    fxType: 'points',
    fxMD: {
      icon: ICONS.hearty,
      foodDesc: 'Restores your health and temporarily increases your maximum hearts.',
      elixirDesc: 'Restores you to full health and increases your maximum hearts. The additional hearts are lost as you take damage.'
    },
    fxData: {
      points: undefined
    }
  },
  energizing: {
    prefix: 'Energizing',
    fxType: 'points',
    fxMD: {
      icon: ICONS.energizing,
      foodDesc: 'Instantly refills some of your Stamina Wheel.',
      elixirDesc: 'Restores your Stamina, which is used when performing physical actions such as climbing walls and swimming.'
    },
    fxData: {
      points: undefined
    }
  },
  enduring: {
    prefix: 'Enduring',
    fxType: 'points',
    fxMD: {
      icon: ICONS.enduring,
      foodDesc: 'Restores and overfills your Stamina Wheel.',
      elixirDesc: 'Restores stamina and temporarily extends your Stamina Wheel. The additional stamina will disappear as it\'s used.'
    },
    fxData: {
      points: undefined
    }
  },
  sneaky: {
    prefix: 'Sneaky',
    fxType: 'timed',
    fxMD: {
      icon: ICONS.sneaky,
      title: 'Stealth Up',
      tierBps: [0, 30, 45], // breakpoints for low, mid, & high
      potencyLevels: [5, 10, 15], // rank 1 mat: 5, rank 2 mat: 10, rank 3 mat: 15
      foodDesc: 'Grants a %s-level stealth boost.',
      elixirDesc: 'Grants a %s-level stealth effect, which calms the nerves and silences footfalls. Allows you to move about undetected by monsters and animals.',
      baseTimeInc: 90, // in seconds
    },
    fxData: {
      totPotency: undefined,
      tierNumber: undefined,
      tierName: undefined,
      time: undefined
    }
  },
  hasty: {
    prefix: 'Hasty',
    fxType: 'timed',
    fxMD: {
      icon: ICONS.hasty,
      title: 'Speed Up',
      tierBps: [0, 30], // breakpoints for low & mid
      potencyLevels: [7, 14],
      foodDesc: 'Grants a %s-level movement-speed boost.',
      elixirDesc: 'Grants a %s-level haste effect, which boosts your movement speed while running, swimming, or climbing.',
      baseTimeInc: 30, // in seconds
    },
    fxData: {
      totPotency: undefined,
      tierNumber: undefined,
      tierName: undefined,
      time: undefined
    }
  },
  mighty: {
    prefix: 'Mighty',
    fxType: 'timed',
    fxMD: {
      icon: ICONS.mighty,
      title: 'Attack Up',
      tierBps: [0, 30, 45], // breakpoints for low, mid, & high
      potencyLevels: [7, 14, 21],  
      foodDesc: 'Grants a %s-level attack-power boost.',
      elixirDesc: 'Grants a %s-level might effect, which strengthens your body and mind to boost your attack power with all weapons.',
      baseTimeInc: 20, // in seconds
    },
    fxData: {
      totPotency: undefined,
      tierNumber: undefined,
      tierName: undefined,
      time: undefined
    }
  },
  tough: {
    prefix: 'Tough',
    fxType: 'timed',
    fxMD: {
      icon: ICONS.tough,
      title: 'Defense Up',
      tierBps: [0, 30, 45], // breakpoints for low, mid, & high
      potencyLevels: [7, 14, 21],
      foodDesc: 'Grants a %s-level defense boost.',
      elixirDesc: 'Grants a %s-level toughness effect, which fortifies your bones to strengthen your defense. Best to use before facing off against hard-hitting enemies.',
      baseTimeInc: 20, // in seconds
    },
    fxData: {
      totPotency: undefined,
      tierNumber: undefined,
      tierName: undefined,
      time: undefined
    }
  },
  spicy: {
    prefix: 'Spicy',
    fxType: 'timed',
    fxMD: {
      icon: ICONS.spicy,
      title: 'Cold Resistance',
      tierBps: [0, 30], // breakpoints for low & mid
      potencyLevels: [5, 10, 15],
      foodDesc: 'Grants %s-level cold resistance.',
      elixirDesc: 'Warms your body from its core, increasing your resistance to cold environments. Very useful in the snow-covered mountains.',
      baseTimeInc: 120, // in seconds
    },
    fxData: {
      totPotency: undefined,
      tierNumber: undefined,
      tierName: undefined,
      time: undefined
    }
  },
  chilly: {
    prefix: 'Chilly',
    fxType: 'timed',
    fxMD: {
      icon: ICONS.chilly,
      title: 'Heat Resistance',
      tierBps: [0, 30], // breakpoints for low & mid
      potencyLevels: [5, 10, 15],
      foodDesc: 'Grants %s-level heat resistance.',
      elixirDesc: 'Grants a %s-level cooling effect, raising your body\'s resistance to heat. Crucial for long journeys through the desert.',
      baseTimeInc: 120, // in seconds
    },
    fxData: {
      totPotency: undefined,
      tierNumber: undefined,
      tierName: undefined,
      time: undefined
    }
  },
  electro: {
    prefix: 'Electro',
    fxType: 'timed',
    fxMD: {
      icon: ICONS.electro,
      title: 'Shock Resistance',
      tierBps: [0, 30, 45], // breakpoints for low & mid
      potencyLevels: [8, 16, 24],
      foodDesc: 'Grants %s-level electricity resistance.',
      elixirDesc: 'Grants a %s-level resistance to electricity. Useful against enemies with electrical attacks.',
      baseTimeInc: 120, // in seconds
    },
    fxData: {
      totPotency: undefined,
      tierNumber: undefined,
      tierName: undefined,
      time: undefined
    }
  },
  fireproof: {
    prefix: 'Fireproof',
    fxType: 'timed',
    fxMD: {
      icon: ICONS.fireproof,
      title: 'Fireproof',
      tierBps: [0, 30], // breakpoints for low & mid
      potencyLevels: [4, 9],
      foodDesc: '(This should never appear.)',
      elixirDesc: 'Grants a fireproof effect, which prevents your body from catching fire. Be sure to pack this when venturing out to explore Death Mountain.',
      baseTimeInc: 120, // in seconds
    },
    fxData: {
      totPotency: undefined,
      tierNumber: undefined,
      tierName: undefined,
      time: undefined
    }
  }
};

// =============================================================================
// - Helpers -------------------------------------------------------------------
// =============================================================================

let funcFunc = (a) => a + 5;

let funcFuncFunc = (a) => {
  return a + 5;
}

// In: Array<String> or String; JSON
// Out: input type, but as Array<Object> or Object containing the looked up values
// Mapped function: find the material whose property "name" is equal to s
//    from materialsList.

let findData = (arg, dict) => {
  if (typeof arg == 'object') {
    let out = R.map(s => R.find(R.propEq('name', s), dict), arg);
    return out;
  } else if (typeof arg == 'string') {
    let out = R.find(R.propEq('name', arg), dict);
    return out;
  }
}
// Abbreviation for 'lookup'
let lm = v => findData(v, materialsList);
let lr = v => findData(v, recipeList);

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
  console.log(`Sum is ${sum} rupees. Total price is ${price} rupees.`);
}

calcRupeePrice(lm(['Raw Gourmet Meat', 'Raw Gourmet Meat', 'Raw Gourmet Meat', 'Raw Gourmet Meat', 'Raw Gourmet Meat']));
calcRupeePrice(lm(['Chickaloo Tree Nut']));



/**
 * In: Non-empty array of material objects, all w/ no effect or same effect;
 *         name of effect, if exists.
 * Out: (insert some properties of the thing here)
 */ 

function getDishEffectDetails(mats, fxName = calcFx(mats)) {
  if (fxName == 'none') return null;

  let fx = MAT_EFFECTS[fxName.toLowerCase()];
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
      fx.fxData.points = fxCausers.reduce(
        (sum, m) => (m.potency) ? sum + m.potency : sum
        , 0);
      console.log(`Sum of points is ${fx.fxData.points}.`);
      // console.log(fx);
      break;
    case 'timed':
      console.log('Timed');
      fx.fxData.totPotency = fxCausers.reduce((sum, m) => 
          (m.potency) ? sum + fx.fxMD.potencyLevels[m.potency - 1] : sum
          , 0);
      let tierNum = getTimedTier(fx.fxData.totPotency, fx.fxMD.tierBps);
      let tierName = (tierNum == 3) ? 'high' : ((tierNum == 2) ? 'mid' : 'low');
      fx.fxData.tierNumber = tierNum;
      fx.fxData.tierName = tierName;
      fx.fxData.time = (30*mats.length) + (fx.fxMD.baseTimeInc*fxCausers.length);
      fx.fxData.time += foodTimeBoost + reagantTimeBoost;
      console.log(fx);


      break;
    default:
      console.error("Something went wrong (getDishEffectDetails)");
  }
}

// getDishEffectDetails(lm(['Hearty Durian', 'Hearty Durian', 'Hearty Truffle', 'Hearty Truffle', 'Apple']));
// getDishEffectDetails(lm(['Hearty Durian', 'Hearty Durian', 'Hearty Truffle', 'Hearty Truffle', 'Hearty Truffle']));
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
let getHpRestore = (mats) => 
  (mats.filter(m => m.effect == "Hearty").length != 0) 
    ? "Full recovery" 
    : mats.reduce((sum, m) => sum + m.hp, 0);

// let ex1_getHpRestore = getHpRestore(lm(['Wildberry', 'Hyrule Herb', 'Hyrule Bass', 'Mighty Bananas']));
// console.log(ex1_getHpRestore);
// let ex2_getHpRestore = getHpRestore(lm(['Wildberry', 'Hyrule Herb', 'Hearty Truffle', 'Mighty Bananas']));
// console.log(ex2_getHpRestore);
// let ex3_getHpRestore = getHpRestore(lm(['Armored Carp', 'Armored Carp', 'Ironshell Crab', 'Ironshell Crab']));
// console.log(ex3_getHpRestore);

// Returns all permutations of an array. Meant to be used w/ max 5 values.
function getPermutations(arr = []) {
var permArr = [],
  usedChars = [];

  function permute(input) {
    var i, ch;
    for (i = 0; i < input.length; i++) {
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
// - Recipe Functions -----------------------------------------------------------------
// =============================================================================

/**
 * In: Array of material objects
 * Out: Either false, 'Dubious Food', or 'Rock-Hard Food'
 * Note: Dubious Food and Rock-Hard Food always sell for 2 rupees
 */
function hasBadMats(mats) {
  // Contains wood or mineral (higher priority than Dubious Food)
  if (mats.filter(m => ['Mineral', 'Wood'].includes(m.type)).length > 0)
    return 'Rock-Hard Food';

  // Has monster part(s) but no critter, or vice versa
  let e = 0;
  if (mats.filter(R.propEq('usage', 'Critter')).length > 0)
    e++;
  if (mats.filter(R.propEq('usage', 'Monster Part')).length > 0)
    e++;
  if (e == 1) return 'Dubious Food';

  // Has monster part + critter, but ingredients have conflicting effects
  if (e == 2) {
    // calcFx returns 'none' if NO effect OR conflicting effect, but since
    //   all critters have an effect, we know 'none' == conflicting effect.
    if (calcFx(mats) == 'none') {
      return 'Dubious Food';
    } else {
      // If it has a monster part + critter and produces a valid effect,
      //   it passes, even if it has bad seasoning combos.
      return false;
    }
  }

  // Materials are fine + has a Nutrition ingredient
  if (mats.filter(R.propEq('usage', 'Food')).length > 0)
    return false;
 
  // Combos hereon out: no monster parts, critters, minerals, wood, or food. 
  // All combos from hereon have _only_ additives.
  // Contains bad seasoning combos
  // TODO

  // All looks good
  return false;
}


console.log(hasBadMats(lm(['Acorn', 'Apple', 'Bokoblin Horn'])));


// In: Recipe obj, Array of material obj
// Out: Boolean

function canCookInto(rcp, mats) {
  let ms = R.clone(mats);

  if (mats.length < rcp.ingredients.length) {
    return false; // Mats has less # of mats than recipe calls for
  }

  // console.log(`Recipe calls for ${rcp.ingredients.length} ingred`);
  // console.log(`Given ingred: ${mats.length}`);

  return R.all(R.__, rcp.ingredients)((el) => {
    let sIdx;
    if (el[0] == 'name') {
      sIdx = ms.findIndex(m => m.name == el[1]);
    } else { // == 'family'
      sIdx = ms.findIndex(m => m.families.includes(el[1]));
    }
    if (sIdx == -1) {
      return false;
    }
    ms = ms.slice(0, sIdx).concat(ms.slice(sIdx + 1));
    return true;
  });
}

console.log(canCookInto(
  lr('Clam Chowder'), 
  lm(['Fresh Milk', 'Tabantha Wheat', 'Goat Butter', 'Hearty Blueshell Snail'])));


console.log(canCookInto(
  lr('Prime Meat Stew'), 
  lm(['Goat Butter', 'Fresh Milk', 'Raw Bird Thigh', 'Tabantha Wheat'])));

console.log(canCookInto(
  lr('Prime Meat Stew'), 
  lm(['Goat Butter', 'Apple', 'Fresh Milk', 'Raw Gourmet Meat', 'Tabantha Wheat'])));

console.log(canCookInto(
  lr('Fruitcake'), 
  lm(['Hearty Durian', 'Sugar Cane', 'Apple', 'Tabantha Wheat'])));




// =============================================================================
// - Functions -----------------------------------------------------------------
// =============================================================================

// Main function
// In: an array of up to 5 strings representing material objects
// Out: a recipe object





function cook(matStrings) {
  let matArr = lm(matStrings);
  let effectName = calcFx(matArr);
  // console.log(mArr);
  // console.log(fx);

  // mArr = R.map(s => R.find(R.propEq('name', s))(materialsList), mArr);
  // let fx = R.reduce(R.concat, [], )
}

// cook(['Hearty Durian', 'Apple', 'Apple', 'Bird Egg', 'Rock Salt']);
// cook(['Fresh Milk', 'Sugar Cane']);
// cook(['Hearty Durian', 'Hearty Truffle']);

