/**
 * Exports all relevant JSON data in this folder.
 * 
 * @author David
 */

// Source link 1:
// Source: https://gaming.stackexchange.com/questions/302414/what-are-the-most-profitable-meals-and-elixirs-i-can-cook

// ——————————————————————————————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————————————————————————————

// Bundle the JSONs in this folder for exporting
let materials = require('./materials')
let recipes = require('./recipes')

// ——————————————————————————————————————————————————————————————————————————
// Normalizing indices for recipes
// ——————————————————————————————————————————————————————————————————————————

recipes.forEach((rcp, idx) => {
  rcp.idx = Number(idx) + 1;
});

// ——————————————————————————————————————————————————————————————————————————
// Adding descriptions
// ——————————————————————————————————————————————————————————————————————————

{
  const matDescs = require('./matDesc')
  const recipeDescs = require('./recipeDesc')
  
  matDescs.forEach(([ matName, desc ]) => {
    for (let i in materials) {
      if (materials[i].name === matName) {
        materials[i] = { ...materials[i], desc };
        break;
      }
    }
  });

  recipeDescs['2'].data.forEach(([ recName, desc ]) => {
    for (let i in recipes) {
      if (recipes[i].name === recName) {
        recipes[i] = { ...recipes[i], desc };
        // break; // There are multiple recipes of the same name
      }
    }
  });

}

// ——————————————————————————————————————————————————————————————————————————
// Adding thumbnail sources
// ——————————————————————————————————————————————————————————————————————————

{
  const thumbs = require('./thumbs')

  thumbs.forEach(el => {
    if (el.name === '???') return;
    if (el.type === 'material') {
      for (let i in materials) {
        if (materials[i].name === el.name) {
          materials[i] = { ...materials[i], thumb: el.thumb };
          break;
        }
      }
      // materials.forEach((mat, i) => {
      //   if (mat.name === el.name) {
      //     materials[i] = { ...materials[i], thumb: el.thumb };
      //   }
      // });
    } else if (el.type === 'recipe') {
      for (let i in recipes) {
        if (recipes[i].name === el.name) {
          recipes[i] = { ...recipes[i], thumb: el.thumb };
          // break; // There are multiple recipes of the same name
        }
      }
      // recipes.forEach((mat, i) => {
      //   if (mat.name === el.name) {
      //     recipes[i] = { ...recipes[i], thumb: el.thumb };
      //   }
      // });

      // recipes = recipes
      //   .filter(obj => obj.name === el.name)
      //   .map(obj => ({ ...obj, thumb: el.thumb }));
    }
  }); 
}

// ——————————————————————————————————————————————————————————————————————————
// Other
// ——————————————————————————————————————————————————————————————————————————

// All materials have a 'Usage', and one of those Usage types is 'Additive'.
// As a rule, recipes are often made of one or more Food use-materials and 
//   zero or more Additives.
// This is a list of recipes who are exceptions to this rule, as they consist
//   _only_ of Additives.
let additiveOnlyRecipes;

{
  // Names of recipes whose ingredients contain only additives.
  const aoRecipeNames = [ // 3, 4, 5, 28, 55, 70, 84, 113
    'Monster Curry',
    'Monster Rice Balls',
    'Monster Cake',
    'Nutcake',
    'Curry Pilaf',
    'Curry Rice',
    'Wheat Bread',
    'Sautéed Nuts'
  ];
  additiveOnlyRecipes = recipes.filter(r => aoRecipeNames.includes(r.name));
}

// —————————————————————————————————————

/**
 * The number of stamina wheels an 'Energizing' recipe restores is equal to the
 * Nth element of this array, where N is the summed potency points of
 * the recipe's Energizing ingredients.
 * 
 * If the potency exceeds the length of this array, the restoration should be
 * capped at 3 wheels.
 */
const energizingLevels = [
  0, 0.2, 0.4, 0.8, 1.0, 1.4, 1.6, 1.8, 2.2, 2.4, 2.8, 3.0
];

/**
 * The number of stamina wheels an 'Enduring' recipe restores is equal to the
 * Nth element of this array, where N is the summed potency points of
 * the recipe's Enduring ingredients.
 * 
 * If the potency exceeds the length of this array, the restoration should be 
 * capped at 2 wheels.
 */
const enduringLevels = [
  0, 0.2, 0.2, 0.2, 0.4, 0.4, 0.6, 0.6, 0.8, 0.8, 1.0, 1.0, 1.2, 1.2, 1.4, 1.4, 
  1.6, 1.6, 1.8, 1.8, 2.0
];

// —————————————————————————————————————

/**
 * Reagents grant bonuses to the recipe effect duration based on their tier.
 * Each reagent's duration bonus, in seconds, is the Nth element of this array,
 * where N is the tier number (from 0 to 2).
 */
const reagantDurationBonuses = [ 40, 80, 160 ];

// —————————————————————————————————————

/**
 * The selling price for a recipe, in Rupees, is equal to the sum of the prices
 * of the recipe's individual ingredients multiplied by this multiplier---the
 * Nth element of this array, where N is the number of ingredients included
 * in the recipe.
 * 
 * This means that the more ingredients are used in a single recipe, the more
 * profitable the resulting recipe.
 */
const priceMultipliers = [ 1, 1.5, 1.75, 2.05, 2.4, 2.8 ];

// —————————————————————————————————————

/**
 * Additional descriptions for recipes based on the type of the effect that one 
 * yields. Descriptions differ among food and elixir recipes, and between types 
 * of effects.
 * 
 * These extra descriptions are appended to the end of a recipe's default 
 * description in the case of a food recipe & become the description in the 
 * case of an elixir recipe.
 */
const effectDescriptions = {
  hearty: {
    foodDesc: 'Restores your health and temporarily increases your maximum ' +
      'hearts.',
    elixirDesc: 'Restores you to full health and increases your maximum ' +
      'hearts. The additional hearts are lost as you take damage.'
  },
  energizing: {
    foodDesc: 'Instantly refills some of your Stamina Wheel.',
    elixirDesc: 'Restores your Stamina, which is used when performing ' +
      'physical actions such as climbing walls and swimming.'
  },
  enduring: {
    foodDesc: 'Restores and overfills your Stamina Wheel.',
    elixirDesc: 'Restores stamina and temporarily extends your Stamina ' +
      'Wheel. The additional stamina will disappear as it\'s used.'
  },
  sneaky: {
    foodDesc: 'Grants a %s-level stealth boost.',
    elixirDesc: 'Grants a %s-level stealth effect, which calms the nerves ' +
      'and silences footfalls. Allows you to move about undetected by ' +
      'monsters and animals.',
    },
  hasty: {
    foodDesc: 'Grants a %s-level movement-speed boost.',
    elixirDesc: 'Grants a %s-level haste effect, which boosts your movement ' +
      'speed while running, swimming, or climbing.',
    },
  mighty: {
    foodDesc: 'Grants a %s-level attack-power boost.',
    elixirDesc: 'Grants a %s-level might effect, which strengthens your body ' +
      'and mind to boost your attack power with all weapons.',
    },
  tough: {
    foodDesc: 'Grants a %s-level defense boost.',
    elixirDesc: 'Grants a %s-level toughness effect, which fortifies your ' +
      'bones to strengthen your defense. Best to use before facing off ' +
      'against hard-hitting enemies.',
    },
  spicy: {
    foodDesc: 'Grants %s-level cold resistance.',
    elixirDesc: 'Warms your body from its core, increasing your resistance ' +
      'to cold environments. Very useful in the snow-covered mountains.',
    },
  chilly: {
    foodDesc: 'Grants %s-level heat resistance.',
    elixirDesc: 'Grants a %s-level cooling effect, raising your body\'s ' +
      'resistance to heat. Crucial for long journeys through the desert.',
    },
  electro: {
    foodDesc: 'Grants %s-level electricity resistance.',
    elixirDesc: 'Grants a %s-level resistance to electricity. Useful against ' +
      'enemies with electrical attacks.',
    },
  fireproof: {
    foodDesc: '(This should never appear.)',
    elixirDesc: 'Grants a fireproof effect, which prevents your body from ' +
      'catching fire. Be sure to pack this when venturing out to explore ' +
      'Death Mountain.',
    }
};

/**
 * Data about the different types of recipe effects. Each effect has the 
 * following fields:
 *  * `prefix`: a string that is prefixed to the title of the recipe. For
 *    example, a "Meat Skewer" with Enduring ingredients would be named 
 *    "Enduring Meat Skewer".
 *  * `fxType`: either `"points"` or `"timed"`. 
 *    
 * Recipes with *point*-based effects yield instant benefits upon consumption, 
 * with the intensity of those benefits able to be represented as the sum of its 
 * ingredients' points.
 * 
 * Recipes with *time*-based effects yield benefits that last a certain
 * duration, like "Attack Up" or "Cold Resistance". These effects can *also*
 * vary in intensity depending on their ingredients, but these intensities are
 * described as two or three "tiers" of potency.
 * 
 * "Timed" effects also have the following fields:
 *  * `title`: The name of the timed effect, like "Attack Up" or "Cold 
 *    Resistance".
 *  * `timedData`: contains three fields:
 *     * `tierBps`: An array whose elements represent the sum of effect points 
 *       needed to break into the next effect tier (higher tier = more intense 
 *       effect.) 
 *     * `potencyLevels`: The number of effect points yielded from an ingredient
 *       of tier 0 or 1 (or 2, in some cases.)
 *     * `contribFactor`: "Base time increase". The base number of seconds during 
 *       which an effect lasts. This number is increased via more ingredients.
 */
const effectData = {
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
    timedData: {
      tierBps: [0, 30, 45], // breakpoints for low, mid, & high
      potencyLevels: [5, 10, 15], // reagants: Rank 1: 5, Rank 2: 10, Rank 3: 15
      contribFactor: 90, // in seconds
    }
  },
  hasty: {
    prefix: 'Hasty',
    fxType: 'timed',
    title: 'Speed Up',
    timedData: {
      tierBps: [0, 30], // breakpoints for low & mid
      potencyLevels: [7, 14],
      contribFactor: 30, // in seconds
    }
  },
  mighty: {
    prefix: 'Mighty',
    fxType: 'timed',
    title: 'Attack Up',
    timedData: {
      tierBps: [0, 30, 45], // breakpoints for low, mid, & high
      potencyLevels: [7, 14, 21],
      contribFactor: 20, // in seconds
    }
  },
  tough: {
    prefix: 'Tough',
    fxType: 'timed',
    title: 'Defense Up',
    timedData: {
      tierBps: [0, 30, 45], // breakpoints for low, mid, & high
      potencyLevels: [7, 14, 21],
      contribFactor: 20, // in seconds
    }
  },
  spicy: {
    prefix: 'Spicy',
    fxType: 'timed',
    title: 'Cold Resistance',
    timedData: {
      tierBps: [0, 30], // breakpoints for low & mid
      potencyLevels: [5, 10, 15],
      contribFactor: 120, // in seconds
    }
  },
  chilly: {
    prefix: 'Chilly',
    fxType: 'timed',
    title: 'Heat Resistance',
    timedData: {
      tierBps: [0, 30], // breakpoints for low & mid
      potencyLevels: [5, 10, 15],
      contribFactor: 120, // in seconds
    }
  },
  electro: {
    prefix: 'Electro',
    fxType: 'timed',
    title: 'Shock Resistance',
    timedData: {
      tierBps: [0, 30, 45], // breakpoints for low & mid
      potencyLevels: [8, 16, 24],
      contribFactor: 120, // in seconds
    }
  },
  fireproof: {
    prefix: 'Fireproof',
    fxType: 'timed',
    title: 'Fireproof',
    timedData: {
      tierBps: [0, 30], // breakpoints for low & mid
      potencyLevels: [4, 9],
      contribFactor: 120, // in seconds
    }
  }
};

// ——————————————————————————————————————————————————————————————————————————
// Exporting
// ——————————————————————————————————————————————————————————————————————————

module.exports = {
  materials,
  recipes,
  // matDescs,
  // recipeDescs,
  additiveOnlyRecipes,
  energizingLevels,
  enduringLevels,
  reagantDurationBonuses,
  priceMultipliers,
  effectDescriptions,
  effectData
};