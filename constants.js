// Source link 1:
// Source: https://gaming.stackexchange.com/questions/302414/what-are-the-most-profitable-meals-and-elixirs-i-can-cook

// =============================================================================
// - External Dependencies -----------------------------------------------------
// =============================================================================

const MAT_DICT = require('./data/materials.json');
const RCP_DICT = require('./data/recipes.json');

const additiveRecipeNo = [3, 4, 5, 28, 55, 70, 84, 113];
const XTRA_RCP_DICT = 
  RCP_DICT.filter(r => additiveRecipeNo.includes(Number(r.idx)));

const MAT_DESC_DICT = require('./data/matDesc.json');
const RCP_DESC_DICT = require('./data/recipeDesc.json');

// =============================================================================
// - Other Constants -----------------------------------------------------------
// =============================================================================

const ENERGIZING_LEVELS = 
  [  0, 0.2, 0.4, 0.8, 1.0, 1.4, 1.6, 1.8, 2.2, 2.4, 
   2.8, 3.0];

// last index is 20. this is the cap
const ENDURING_LEVELS =   
  [  0, 0.2, 0.2, 0.2, 0.4, 0.4, 0.6, 0.6, 0.8, 0.8, 
   1.0, 1.0, 1.2, 1.2, 1.4, 1.4, 1.6, 1.6, 1.8, 1.8, 2.0];

const REAGANT_TIERS = [40, 80, 160];

// See Source link 1 at top of script
const PRICE_MULTIPLIER = [1.5, 1.75, 2.05, 2.4, 2.8];

const EFFECT_DESC = {
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
      potencyLevels: [5, 10, 15], // reagants: Rank 1: 5, Rank 2: 10, Rank 3: 15
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
// - Exports -------------------------------------------------------------------
// =============================================================================

module.exports = {
  matDict: MAT_DICT,
  rcpDict: RCP_DICT,
  xtraRcpDict: XTRA_RCP_DICT,
  matDescDict: MAT_DESC_DICT,
  rcpDescDict: RCP_DESC_DICT,

  priceMultiplier: PRICE_MULTIPLIER,

  energizingLvls: ENERGIZING_LEVELS,
  enduringLvls: ENDURING_LEVELS,
  reagantTiers: REAGANT_TIERS,
  fxDesc: EFFECT_DESC,
  matFx: MAT_EFFECTS

  // MAT_DICT: matDict,
  // RCP_DICT: rcpDict,
  // XTRA_RCP_DICT: xtraRcpDict,
  // MAT_DESC_DICT: matDescDict,
  // RCP_DESC_DICT: rcpDescDict,

  // PRICE_MULTIPLIER: priceMultiplier,

  // ENERGIZING_LEVELS: energizingLvls,
  // ENDURING_LEVELS: enduringLvls,
  // REAGANT_TIERS: reagantTiers,
  // EFFECT_DESC: fxDesc,
  // MAT_EFFECTS: matFx
}