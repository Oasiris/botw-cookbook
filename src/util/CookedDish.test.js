/**
 * Big testing file for CookedDish.
 */

// —————————————————————————————————————
// Dependencies
// —————————————————————————————————————

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

  // Some other tests
  {
    mats: 'Raw Prime Meat, Monster Extract, Bright-Eyed Crab',
    output: {
      name: 'Energizing Monster Stew',
      hpRestore: 4 * 5,
      effectData: {
        stamina: 0.4
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
    }

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
  const matNameArray = str.split(',').map(m => m.trim()).filter(s => s !== '');
  // const 


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

        it(set.mats, () => {
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
                  console.log(dish);
                }
                expect(dish[property][pp]).toEqual(set.output[property][pp]);
              })
            } else {
              // Smarter debugging -- display full "actual" dish in case of an error
              if (dish[property] !== set.output[property]) {
                console.log(dish);
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