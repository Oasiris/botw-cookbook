/**
 * Big testing file for CookedDish.
 */

// —————————————————————————————————————
// Dependencies
// —————————————————————————————————————

import C from '../data/all.json';

import CookingUtil, { Mat, Rcp } from './CookingUtil'
import CookedDish from './CookedDish'

import R, { curry, compose, pipe, __ } from 'ramda';

import { exists, match, matchK, ifExists } from './utility'

/**
 * Testing for CookedDish is going to look like this:
 * 
 * A CookedDish is created by invoking the factory method 'ofMats' and providing
 * an array of Mat objects, and is the primary location in the frontend where
 * "cooking calculation" will occur. This is also the operation that will
 * require the most heavy testing. 
 * 
 * Behind the scenes, this invokes the method `cook` from the utility class 
 * CookingUtil. Hence, this entire testscript can be seen as an extension of
 * `CookingUtil.test.js`.
 */

// —————————————————————————————————————
// Testing Sets
// —————————————————————————————————————

/**
 * In some instances, we want to test the dish resulting from cooking a set of 
 * Mats, but we only know _some_ attributes about said dish (most commonly, we
 * might not know the rupee price, but we _do_ know the dish name.)
 * 
 * The testing sets in this array are for instances like those.
 */
const partialTestingSets = [
  { // Additive based
    mats: 'Fairy',
    output: {
      name: 'Fairy Tonic'
    }
  },
  {
    mats: 'Fresh Milk',
    output: {
      name: 'Warm Milk'
    }
  },
  // Alex Ren's boring dishes
  {
    mats: 'Palm Fruit, Palm Fruit, Palm Fruit, Palm Fruit, Palm Fruit',
    output: {
      name: 'Simmered Fruit',
      desc: 'This sweet dish is made by heaping tasty fruits into a pan and simmering until tender.',
      hpRestore: 40
    },
    source: "Alex Ren's Save"
  },
  {
    mats: 'Apple, Apple, Apple, Palm Fruit, Palm Fruit',
    output: {
      name: 'Simmered Fruit',
      hpRestore: 7 * 4,
      effectData: 'no effect'
    }
  },
  {
    mats: 'Raw Gourmet Meat, Raw Gourmet Meat, Raw Gourmet Meat, Raw Gourmet Meat',
    output: {
      name: 'Meat Skewer',
      effectData: 'no effect',
      hpRestore: 24 * 4,
      desc: 'A juicy, filling snack made by grilling small chunks of meat on a skewer.'
    }
  },
  {
    mats: 'Big Hearty Truffle',
    output: {
      name: 'Hearty Mushroom Skewer',
      hpRestore: Infinity, // Full recovery
      effectData: { prefix: 'Hearty', extraHearts: 4 }
    }
  },
  {
    mats: 'Big Hearty Radish, Big Hearty Radish',
    output: {
      name: 'Hearty Fried Wild Greens',
      hpRestore: Infinity,
      effectData: { prefix: 'Hearty', extraHearts: 10 }
    }
  },
  {
    mats: 'Stamella Shroom, Stamella Shroom, Stamella Shroom, Stamella Shroom, Stamella Shroom',
    output: {
      name: 'Energizing Mushroom Skewer',
      hpRestore: 4 * 5,
      effectData: { prefix: 'Energizing', stamina: 1.4 },
    }
  },
  {
    mats: 'Stamella Shroom, Stamella Shroom, Stamella Shroom, Stamella Shroom, Bright-Eyed Crab',
    output: {
      name: 'Energizing Fish and Mushroom Skewer',
      hpRestore: 4 * 6,
      effectData: { prefix: 'Energizing', stamina: 1.6 }
    }
  },


  {
    mats: 'Hightail Lizard',
    output: {
      name: 'Dubious Food',
    }
  },

  // Cemu save file test
  {
    mats: 'Apple, Hylian Shroom, Hyrule Herb',
    output: {
      name: 'Steamed Mushrooms',
      hpRestore: 4 * 4,
      effectData: 'no effect'
    }
  },
  {
    mats: 'Hot-Footed Frog, Hot-Footed Frog, Lizalfos Tail',
    output: {
      name: 'Hasty Elixir',
      hpRestore: 0,
      effectData: { 
        prefix: 'Hasty',
        fxType: 'timed',
        tierName: 'low',
        duration: 5 * 60 + 10
      },
      // apple: true
    }
  },
  {
    mats: 'Hightail Lizard, Bokoblin Horn',
    output: {
      name: 'Hasty Elixir',
      hpRestore: 0,
      effectData: {
        prefix: 'Hasty',
        fxType: 'timed',
        tierName: 'low',
        duration: 2 * 60 + 10,
        title: 'Speed Up'
      }
    }
  },
  {
    mats: 'Fireproof Lizard, Fireproof Lizard, Bokoblin Horn',
    output: {
      name: 'Fireproof Elixir',
      hpRestore: 0,
      effectData: {
        prefix: 'Fireproof',
        fxType: 'timed',
        tierName: 'low',
        duration: 6 * 60 + 10,
        title: 'Flame Guard'
      }
    }
  },
  {
    mats: 'Fireproof Lizard, Bokoblin Horn',
    output: {
      name: 'Fireproof Elixir',
      hpRestore: 0,
      effectData: {
        duration: 3 * 60 + 40,
      }
    }

  },

  // Cemu test: Targeted at seafood/crab/fish
  {
    mats: 'Hylian Rice, Bright-Eyed Crab',
    output: {
      name: 'Energizing Seafood Rice Balls',
      hpRestore: 4 * 4,
      effectData: {
        stamina: 0.4
      }
    }
  },
  {
    mats: 'Hylian Rice, Hearty Blueshell Snail',
    output: {
      name: 'Hearty Seafood Rice Balls',
      hpRestore: Infinity,
      effectData: {
        extraHearts: 3
      }
    }
  },
  {
    mats: 'Rock Salt, Razorclaw Crab',
    output: {
      name: 'Mighty Salt-Grilled Crab',
      hpRestore: 2 * 4,
      effectData: {
        tierNumber: 1,
        duration: 1 * 60 + 50
      }
    }
  },
  {
    mats: 'Rock Salt, Hearty Blueshell Snail',
    output: {
      name: 'Hearty Salt-Grilled Fish',
      hpRestore: Infinity,
      effectData: {
        extraHearts: 3
      }
    }
  },
  {
    mats: 'Hearty Blueshell Snail, Razorclaw Crab, Ironshell Crab, Bright-Eyed Crab',
    output: {
      name: 'Copious Seafood Skewers',
      hpRestore: 12 * 4,
      effectData: 'no effect'
    }
  },
  {
    mats: 'Chillfin Trout, Sizzlefin Trout, Voltfin Trout, Stealthfin Trout',
    output: {
      name: 'Copious Seafood Skewers',
      hpRestore: 8 * 4,
      effectData: 'no effect'
    }
  },
  {
    mats: 'Hyrule Herb, Sneaky River Snail',
    output: {
      name: 'Sneaky Steamed Fish',
      hpRestore: 4 * 4,
      effectData: { tierNumber: 1, tierName: 'low', duration: 2 * 60 + 30 }
    }
  },
  {
    mats: 'Hearty Blueshell Snail',
    output: {
      name: 'Hearty Seafood Skewer',
      hpRestore: Infinity,
      effectData: { prefix: 'Hearty', extraHearts: 3 }
    }
  },
  {
    mats: 'Sizzlefin Trout',
    output: {
      name: 'Spicy Fish Skewer',
      hpRestore: 2 * 4,
      effectData: { prefix: 'Spicy', tierName: 'low', duration: 2 * 60 + 30 }
    }
  },
  {
    mats: 'Spicy Pepper, Ironshell Crab',
    output: {
      name: 'Pepper Seafood',
      hpRestore: 3 * 4,
      effectData: 'no effect'
    }
  },

  // Related to effect cancelling
  {
    mats: 'Hydromelon, Voltfruit, Hearty Radish, Fresh Milk',
    output: {
      name: 'Creamy Heart Soup',
      hpRestore: 8 * 4,
      effectData: 'no effect'
    }
  },

  // Cooking recipes

  // Unique ingredients when trying to make dishes of certain recipes
  {
    mats: 'Tabantha Wheat, Cane Sugar, Apple, Apple',
    output: {
      name: 'Simmered Fruit',
      hpRestore: 4 * 4,
      effectData: 'no effect'
    },
    source: 'Cemu direct test'
  },
  {
    mats: 'Tabantha Wheat, Cane Sugar, Apple, Wildberry',
    output: {
      name: 'Fruitcake',
      hpRestore: 5 * 4,
      effectData: 'no effect'
    },
    source: 'Cemu direct',
    _notes: 'I expected this to be 4 hearts but it was 5. Is the Cane Sugar adding a heart???'
  },


  // More Cane Sugar testing to see what's up with Fruitcakes
  {
    mats: 'Fortified Pumpkin, Tabantha Wheat, Cane Sugar, Goat Butter',
    output: {
      name: 'Tough Pumpkin Pie', // Pumpkin Pie -- #22,
      hpRestore: 3 * 4,
      effectData: { tierName: 'low', duration: 4 * 60 + 30 }
    },
    source: 'Cemu direct'
  },
  {
    mats: 'Fortified Pumpkin, Tabantha Wheat, Cane Sugar, Cane Sugar, Goat Butter',
    output: {
      name: 'Tough Pumpkin Pie', // Pumpkin Pie -- #22,
      hpRestore: 3 * 4,
      effectData: { tierName: 'low', duration: 5 * 60 }
    },
    source: 'Cemu direct',
    _note: 'Actually uncovered a bug where including the same duration-extending ingredient twice would cause the duration extension to happen twice'
  },

  // ...and back to Fruitcakes
  {
    mats: 'Wildberry, Hydromelon, Tabantha Wheat, Cane Sugar',
    output: {
      name: 'Chilly Fruitcake',
      hpRestore: 5 * 4,
      effectData: {
        tierName: 'low',
        title: 'Heat Resistance',
        duration: 5 * 60 + 20
      }
    },
    source: 'Cemu direct'
  }, 
  
  // Testing more pastries
  {
    // Carrot Cake
    mats: 'Endura Carrot, Tabantha Wheat, Cane Sugar, Goat Butter',
    output: {
      name: 'Enduring Carrot Cake',
      hpRestore: 6 * 4,
      effectData: { extraStamina: 0.4 }
    },
    _note: 'No error thrown => no heart bonus'
  },
  {
    // Wildberry Crepe
    mats: 'Wildberry, Fresh Milk, Bird Egg, Cane Sugar, Tabantha Wheat',
    output: {
      name: 'Wildberry Crepe',
      hpRestore: 10 * 4,
      effectData: 'no effect'
    },
    _note: '10 hearts restored (4 heart bonus). Confirmed online. https://www.youtube.com/watch?v=Ca8LTqlY38o #1'
  },
  {
    // Honey Crepe
    mats: 'Courser Bee Honey, Fresh Milk, Bird Egg, Cane Sugar, Tabantha Wheat',
    output: {
      name: 'Energizing Honey Crepe',
      hpRestore: 10 * 4,
      effectData: { stamina: 0.4 }
    },
    _note: '10 hearts restored (1 heart bonus). Confirmed online.'
  },
  {
    // Plain Crepe
    mats: 'Fresh Milk, Bird Egg, Cane Sugar, Tabantha Wheat',
    output: {
      name: 'Plain Crepe',
      hpRestore: 5 * 4,
    },
    _note: 'No heart bonus'
  },
  {
    // Plain Crepe (w/ added stuff, in this case a Palm Fruit)
    mats: 'Fresh Milk, Bird Egg, Cane Sugar, Tabantha Wheat, Palm Fruit',
    output: {
      name: 'Plain Crepe',
      hpRestore: 7 * 4,
    },
    _note: 'No heart bonus'
  },
  {
    // Apple Pie
    mats: 'Apple, Cane Sugar, Tabantha Wheat, Goat Butter',
    output: {
      name: 'Apple Pie',
      hpRestore: 3 * 4,
    },
    _note: 'No heart bonus'
  },
  {
    // Nutcake
    mats: 'Chickaloo Tree Nut, Cane Sugar, Tabantha Wheat, Goat Butter',
    output: {
      name: 'Nutcake',
      hpRestore: 3 * 4,
    },
    _note: 'No heart bonus'
  },
  {
    // Egg Tart
    mats: 'Bird Egg, Cane Sugar, Tabantha Wheat, Goat Butter',
    output: {
      name: 'Egg Tart',
      hpRestore: 4 * 4,
    },
    _note: 'No heart bonus'
  },
  {
    // Egg Tart
    mats: 'Bird Egg, Cane Sugar, Fresh Milk',
    output: {
      name: 'Egg Pudding',
      hpRestore: 3 * 4,
    },
    _note: 'No heart bonus'
  },


  {
    // Hot Buttered Apple
    // Now I need to test more than just pastries -- I should test _everything_
    mats: 'Apple, Wildberry, Fleet-Lotus Seeds, Tabantha Wheat, Goat Butter',
    output: {
      name: 'Hasty Hot Buttered Apple',
      hpRestore: 6 * 4,
      effectData: { tierNumber: 1, duration: 4 * 60 + 20 }
    },
    _note: '1 heart more than expected'
  },
  {
    mats: 'Apple, Goat Butter',
    output: {
      name: 'Hot Buttered Apple',
      hpRestore: 2 * 4
    },
    _note: '1 heart bonus'
  },




  // Making sure that duration-extending additives' effects kick in only once per unique additive
  {
    mats: 'Hydromelon, Cane Sugar',
    output: {
      name: 'Chilly Simmered Fruit',
      hpRestore: 1 * 4,
      effectData: { duration: 3 * 60 + 50 }
    },
    source: 'Cemu direct',
  },
  {
    mats: 'Hydromelon, Cane Sugar, Cane Sugar',
    output: {
      hpRestore: 1 * 4,
      effectData: { duration: 4 * 60 + 20 }
    },
    source: 'Cemu direct',
    _notes: 'Notice the duration only goes up by 30 -- the Cane Sugar duration bonus doesn\'t kick in again.'
  },
  {
    mats: 'Hydromelon, Cane Sugar, Cane Sugar, Goat Butter',
    output: {
      hpRestore: 1 * 4,
      effectData: { duration: 5 * 60 + 40 }
    },
    source: 'Cemu direct',
  },
  {
    mats: 'Hydromelon, Cane Sugar, Cane Sugar, Goat Butter, Goat Butter',
    output: {
      hpRestore: 1 * 4,
      effectData: { duration: 6 * 60 + 10 }
    },
    source: 'Cemu direct',
  },

  // Seafood Paella with Armored Porgy
  {
    mats: 'Hylian Rice, Goat Butter, Rock Salt, Armored Porgy, Hearty Blueshell Snail',
    output: {
      name: 'Seafood Paella',
      hpRestore: 12 * 4,
      effectData: 'no effect'
    },
    _note: 'Restores 2 more hearts than it should -- 2 heart bonus'
  },

  // Testing additives
  {
    mats: 'Courser Bee Honey, Cane Sugar',
    output: {
      name: 'Dubious Food',
      hpRestore: 2 * 4
    },
    source: 'Cemu direct'
  },
  {
    mats: 'Courser Bee Honey, Goat Butter',
    output: {
      name: 'Dubious Food',
      hpRestore: 2 * 4
    },
    source: 'Cemu direct'
  },
  // Generic honey tests
  {
    mats: 'Stamella Shroom, Stamella Shroom, Courser Bee Honey',
    output: {
      name: 'Energizing Glazed Mushrooms',
      desc: 'Instantly refills some of your Stamina Wheel.\nThe honey in this mushroom dish gives it a sweet, complex taste and a savory finish.',
      hpRestore: 6 * 4,
      effectData: { stamina: 1.0 }
    },
    source: 'Cemu direct'
  },

  // Confirming that Clam Chowder can only be made with Hearty Blueshell Snail and not Sneaky River Snail
  {
    mats: 'Fresh Milk, Tabantha Wheat, Goat Butter, Hearty Blueshell Snail',
    output: {
      name: 'Hearty Clam Chowder'
    },
    source: 'Cemu direct'
  },
  {
    mats: 'Fresh Milk, Tabantha Wheat, Goat Butter, Sneaky River Snail',
    output: {
      name: 'Sneaky Seafood Meunière',
      hpRestore: 5 * 4,
      effectData: { tierNumber: 1, duration: 5 * 60 + 40 }
    },
    source: 'Cemu direct'
  },

  // Ignore this now, but I was testing behavior related to dishes w/ additives 
  // and picking which dish to output
  {
    mats: 'Hearty Radish, Fresh Milk, Tabantha Wheat, Goat Butter, Hearty Blueshell Snail',
    output: {
      name: 'Hearty Clam Chowder',
      hpRestore: Infinity,
      effectData: { extraHearts: 6 }
    },
    source: 'Cemu direct',
  },
  {
    mats: 'Fresh Milk, Tabantha Wheat, Goat Butter, Sneaky River Snail, Hearty Blueshell Snail',
    output: {
      name: 'Clam Chowder'
    },
    source: 'Cemu direct'
  },
  {
    mats: 'Acorn, Fresh Milk, Tabantha Wheat, Goat Butter, Hearty Blueshell Snail',
    output: {
      name: 'Hearty Clam Chowder',
    },
    source: 'Cemu direct'
  },
  {
    mats: 'Hylian Rice, Fresh Milk, Tabantha Wheat, Goat Butter, Hearty Blueshell Snail',
    output: {
      name: 'Hearty Clam Chowder',
    },
    source: 'Cemu direct'
  }, 
  {
    mats: 'Fresh Milk, Tabantha Wheat, Goat Butter, Courser Bee Honey, Hearty Blueshell Snail',
    output: {
      name: 'Clam Chowder',
      hpRestore: 13 * 4,
      effectData: 'no effect'
    },
    source: 'Cemu direct'
  },
  {
    mats: 'Raw Bird Drumstick, Fresh Milk, Tabantha Wheat, Goat Butter, Hearty Blueshell Snail',
    output: {
      name: 'Hearty Clam Chowder',
    },
    source: 'Cemu direct'
  },
  {
    mats: 'Fresh Milk, Tabantha Wheat, Goat Butter, Courser Bee Honey, Monster Extract',
    output: {
      name: 'Energizing Monster Soup',
      effectData: { prefix: 'Energizing' }
    },
    source: 'Cemu direct',
  },
  {
    mats: 'Fresh Milk, Tabantha Wheat, Goat Butter, Raw Bird Drumstick, Monster Extract',
    output: {
      name: 'Monster Soup',
    },
    source: 'Cemu direct',
  },

  // Other misc dishes
  
  {
    mats: 'Bird Egg, Courser Bee Honey, Courser Bee Honey, Courser Bee Honey',
    output: {
      name: 'Energizing Omelet',
      hpRestore: 14 * 4,
      effectData: { fxType: 'points', stamina: 1.6 }
    },
    source: 'Cemu direct'
  },
  {
    mats: 'Apple, Wildberry',
    output: {
      name: 'Simmered Fruit',
      hpRestore: 2 * 4
    },
    source: 'Cemu direct'
  },

  // Test 1+ of each dish

  {
    mats: 'Cool Safflina, Fresh Milk, Voltfruit, Hydromelon, Hearty Radish',
    output: {
      name: 'Creamy Heart Soup',
      hpRestore: 8 * 4,
      effectData: 'no effect'
    },
    source: 'Cemu direct'
  },
  {
    mats: 'Fresh Milk, Tabantha Wheat, Goat Butter, Fortified Pumpkin',
    output: {
      name: 'Tough Pumpkin Stew',
      hpRestore: 4 * 4,
      effectData: { tierNumber: 1, duration: 4 * 60 + 30 }
    },
    source: 'Cemu direct'
  },
  {
    mats: 'Hylian Rice, Goron Spice, Raw Gourmet Meat',
    output: {
      name: 'Gourmet Meat Curry',
      hpRestore: 8 * 4,
      effectData: 'no effect'
    },
    source: 'Cemu direct'
  },
  {
    mats: 'Hylian Rice, Goron Spice, Mighty Porgy',
    output: {
      name: 'Mighty Seafood Curry',
      hpRestore: 4 * 4,
      effectData: { tierNumber: 1, duration: 3 * 60 + 20 }
    },
    source: 'Cemu direct'
  },
  {
    mats: 'Hylian Rice, Goron Spice, Hearty Blueshell Snail',
    output: {
      name: 'Hearty Seafood Curry',
      hpRestore: Infinity,
      effectData: { extraHearts: 3 }
    },
    source: 'Cemu direct'
  },
  {
    mats: 'Voltfruit, Tabantha Wheat, Cane Sugar, Goat Butter',
    output: {
      name: 'Electro Fruit Pie',
      hpRestore: 3 * 4,
      effectData: { tierNumber: 1, duration: 6 * 60 + 10 }
    },
    source: 'Cemu direct'
  },
  {
    mats: 'Cool Safflina, Hylian Rice, Goat Butter, Rock Salt, Hearty Salmon',
    output: {
      name: 'Salmon Risotto',
      hpRestore: 10 * 4,
      effectData: 'no effect'
    },
    source: 'Cemu direct'
  },
  {
    mats: 'Tabantha Wheat, Goat Butter, Mighty Porgy',
    output: {
      name: 'Mighty Porgy Meunière',
      hpRestore: 4 * 4,
      effectData: { tierNumber: 1, duration: 3 * 60 + 10 }
    },
    source: 'Cemu direct'
  },


  {
    // Attempt to make Seafood Curry but switch out Porgy/Blueshell w/ Trout
    mats: 'Hylian Rice, Goron Spice, Sizzlefin Trout',
    output: {
      name: 'Spicy Seafood Rice Balls',
      hpRestore: 4 * 4,
      effectData: { tierNumber: 1, duration: 5 * 60 }
    },
    source: 'Cemu direct'
  },

  // Monster series and forced +3 heart bonus testing
  {
    mats: 'Hylian Rice, Goron Spice, Monster Extract',
    output: {
      name: 'Monster Curry',
      hpRestore: 5 * 4
    },
    source: "Cemu direct",
    _note: "Can't get +3 heart bonus (it's as though it's built in.) Often gets 1/4 heart deficit."
  },
  {
    mats: 'Hylian Rice, Rock Salt, Monster Extract',
    output: {
      name: 'Monster Rice Balls',
      hpRestore: 5 * 4
    },
    source: 'Cemu direct',
    _note: "Can't get +3 heart bonus (it's as though it's built in.) Often gets 1/4 heart deficit."
  },
  {
    mats: 'Apple, Palm Fruit, Hylian Rice, Rock Salt, Monster Extract',
    output: {
      name: 'Monster Rice Balls',
      hpRestore: 8 * 4
    },
    source: 'Cemu direct',
    _note: "Can't get +3 heart bonus (it's as though it's built in.) Often gets 1/4 heart deficit."
  },
  {
    mats: 'Raw Prime Meat, Monster Extract, Bright-Eyed Crab',
    output: {
      name: 'Energizing Monster Stew',
      hpRestore: 5 * 4,
      effectData: {
        stamina: 0.4
      }
    },
    _note: "Can get both +3 heart bonus and 1/4 heart deficit."
  },
  {
    mats: 'Raw Meat, Monster Extract, Armored Porgy',
    output: {
      name: 'Tough Monster Stew',
      hpRestore: 4 * 4,
      effectData: {
        prefix: 'Tough'
      }
    },
    _note: "Can get both +3 heart bonus and 1/4 heart deficit."
  },
  {
    mats: 'Cane Sugar, Tabantha Wheat, Goat Butter, Monster Extract',
    output: {
      name: 'Monster Cake',
      hpRestore: 5 * 4,
      effectData: 'no effect'
    },
    _note: "Can't get +3 heart bonus (it's as though it's built in.) Often gets 1/4 heart deficit."
  },


];

const fullTestingSets = [
  {
    mats: 'Acorn',
    output: {
      mats: [Mat.ofName('Acorn')],
      rcp: Rcp.ofName('Sautéed Nuts'),
      name: 'Sautéed Nuts',
      thumb: 'thumb-12-12.png',
      desc: 'These sautéed tree seeds are the perfect snack for the busy adventurer on the go!',
      effectData: 'no effect',
      hpRestore: 2,
      rupeePrice: 8
    }
  }
]

// —————————————————————————————————————
// Helper Functions
// —————————————————————————————————————

const matsFromString = str => {
  const matNameArray = str.split(',').map(m => m.trim()).filter(s => s !== '');
  const matArray = matNameArray.map(m => Mat.ofName(m));
  return matArray;
}

const describeSet = set => {
  let description = '';
  if (set.output && set.output.name) {
    description += `[${set.output.name}] `;
  }
 
  const matNameArray = set.mats.split(',').map(m => m.trim()).filter(s => s !== '');

  const matNicknames = [
    ['Hearty', 'Hty'],
    ['Tabantha Wheat', 'T-Wheat'],
    ['Fresh Milk', 'F-Milk'],
    ['Goat Butter', 'G-Butter'],
    ['Goron Spice', 'G-Spice'],
    ['Monster', 'Mon'],
    ['Rock Salt', 'R-Salt'],
    ['Hylian Rice', 'H-Rice'],
    ['Cane Sugar', 'C-Sugar'],
    ['Courser Bee Honey', 'C.B.Honey'],
    ['Bird Egg', 'B-Egg'],
    ['Chickaloo Tree Nut', 'C-Tree Nut']
  ];

  // Replace names of mats with nicknames here
  const abbrevNameArray = matNameArray.map(matName => {
    let abbrevName = String(matName);
    matNicknames.forEach(([ longStr, shortStr ]) => {
      abbrevName = abbrevName.replace(new RegExp(longStr, 'g'), shortStr);
    });
    return abbrevName;
  });
    
  description += abbrevNameArray.join(', ');
  return description;
}

// Tests
describe('Helper functions', () => {
  describe('matsFromString', () => {
    it('Basic tests', () => {
      expect(matsFromString('Hearty Durian'))
        .toEqual([ Mat.ofName('Hearty Durian') ]);

      expect(matsFromString('Apple, Tabantha Wheat'))
        .toEqual([ Mat.ofName('Apple'), Mat.ofName('Tabantha Wheat') ]);  

      expect(matsFromString('Monster Extract, Goat Butter, Fresh Milk'))
        .toEqual([
          Mat.ofName('Monster Extract'),
          Mat.ofName('Goat Butter'),
          Mat.ofName('Fresh Milk'),
        ]);
    });
  });
});

// —————————————————————————————————————
// Test Driver
// —————————————————————————————————————

describe('CookedDish', () => {
  it('exists', () => {
    expect(exists(CookedDish)).toBe(true);
  });
  
  describe('ofMats', () => {
    describe('partial testing sets', () => {
      partialTestingSets.forEach(set => {
        const mats = matsFromString(set.mats);

        const testDescription = describeSet(set);
        // it(set.mats, () => {
        it(testDescription, () => {
          const dish = CookedDish.ofMats(mats);
          // We expect every property that's described in the p. testing set
          // to match with the actual output, `dish`.
          Object.keys(set.output).forEach(property => {
            if (R.is(Object, set.output[property])) {
              // If the property itself is an object: instead of directly
              // comparing the real and expected properties, we'll compare
              // each property in that object.
              Object.keys(set.output[property]).forEach(pp => {
                // Smarter debugging -- display full "actual" dish in case of an error
                if (dish[property][pp] !== set.output[property][pp]) {
                  // console.log(dish);
                }
                expect(dish[property][pp]).toEqual(set.output[property][pp]);
              })
            } else {
              // Smarter debugging -- display full "actual" dish in case of an error
              if (dish[property] !== set.output[property]) {
                // console.log(dish);
              }

              expect(dish[property]).toEqual(set.output[property]);
            }
          });
        });
      });
    });

    describe('full testing sets', () => {
      fullTestingSets.forEach(set => {
        const mats = matsFromString(set.mats);
        
        it(set.mats, () => {
          const dish = CookedDish.ofMats(mats);
          const expected = { ...set.output, _filled: true };
          const actual = { ...dish };
          expect(actual).toEqual(expected);
        });


      });


    });

  });
});

// End results
it('《Final test analysis》', () => {
  let testedRecipes = [];
  partialTestingSets.forEach(set => {
    const dish = CookedDish.ofMats(matsFromString(set.mats));
    testedRecipes.push(dish.rcp.name);
  });
  testedRecipes = R.uniq(testedRecipes);

  console.log(`You've tested ${testedRecipes.length} out of ${C.recipes.length} recipes so far.`);
});