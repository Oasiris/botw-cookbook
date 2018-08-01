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
  {
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
  }

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
          Object.keys(set.output).forEach(property => {
            expect(dish[property]).toEqual(set.output[property]);
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