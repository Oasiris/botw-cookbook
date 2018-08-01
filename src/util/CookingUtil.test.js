/**
 * Big testing file for CookingUtil.
 */

// —————————————————————————————————————
// Dependencies
// —————————————————————————————————————

import CookingUtil, { Mat, Rcp } from './CookingUtil'

import R, { curry, compose, pipe, __ } from 'ramda';

import { exists, match, matchK, ifExists } from './utility'

// —————————————————————————————————————
// Helpers 
// —————————————————————————————————————

/**
 * Returns the number of health points (each representing 1/4th of 
 *  a heart) corresponding to the input number of hearts.
 * @param {number} numHearts
 */
const hearts = (numHearts) => 4 * numHearts; 

// —————————————————————————————————————
// Testing Data
// —————————————————————————————————————

/**
 * An array of "Mat testing sets." Here, a testing set is defined as a set 
 * of:
 * - A list of materials, and
 * - The expected outputs for functions to be tested with the materials as 
 *    the expected input.
 * 
 * ——————————————————————————————
 * 
 * There are other properties to testing sets, preceded by underscores.
 * 
 * - _notes: Any supplemental notes or information worth noting about a
 *    a particular input/output set for this Mat testing set. Notes will appear
 *    at the beginning of a description for an `it` testing block in the 
 *    terminal.
 * - _alias: A string to replace the property 'names' for the descriptions in
 *    the set's 'it' testing blocks, for readability's sake.
 * - _source: Currently, a note for the developer's eyes only. The data source
 *    from which the test has arisen.
 * 
 * ——————————————————————————————
 * 
 * The following is a list of _testing data sources_ that the testing data
 * will arise from.
 * 
 * * S0: `_old` test file.
 * * S1: Spreadsheet: ["Zelda: Breath of the Wild Recipes"](http://docs.google.com/spreadsheets/d/1LskydTTg92HeJpJnCTQxqxBL89Ebh6J6ZYQ5VQ40D-c)
 * * S2: Spreadsheet: ["BREATH OF THE WILD - RECIPES"](http://docs.google.com/spreadsheets/d/13Cvmddd5m3R0ht4ZmE1L4RRXqaPMPvLh7FoW4TKI7mk)
 */
const matTestingSets = [
  {
    names: 'Raw Gourmet Meat, Raw Gourmet Meat, Raw Gourmet Meat, Raw Gourmet Meat',
    _alias: 'Raw Gourmet Meat x4',
    rupeePrice: 340,
    recipeType: 'Food'
  }, 
  {
    names: 'Raw Gourmet Meat, Raw Gourmet Meat, Raw Gourmet Meat, Raw Gourmet Meat, Raw Gourmet Meat',
    _alias: 'Raw Gourmet Meat x5',    
    rupeePrice: 490,
    recipeType: 'Food'
  },
  {
    _notes: { rupeePrice: ['Edge case'] },
    names: 'Acorn',
    rupeePrice: 8,
    recipeType: 'Food'
  },
  {
    names: 'Chickaloo Tree Nut',
    rupeePrice: 10,
    recipeType: 'Food'
  },

  // Relating to calculating restored HP.

  {
    names: 'Apple, Tabantha Wheat, Cane Sugar, Goat Butter',
    hpRestore: hearts(3),
    _source: 'S1 Row 2'
  },
  {
    names: 'Hydromelon, Voltfruit, Hearty Radish, Fresh Milk',
    hpRestore: Infinity,
    _source: 'S1 Row 5',
    _naive: {
      hpRestore: hearts(8)
    }
  },
  {
    names: 'Zapshroom',
    hpRestore: hearts(1),
    _source: 'S1 Row 6'
  },
  {
    names: R.repeat('Stamella Shroom', 5).join(', '),
    hpRestore: hearts(5),
    _source: 'S1 Row 11'
  },
  {
    names: R.repeat('Hyrule Herb', 1).join(', '),
    hpRestore: hearts(2),
    _source: 'S1 Row 16'
  },
  {
    names: R.repeat('Hyrule Herb', 2).join(', '),
    hpRestore: hearts(4),
    _source: 'S1 Row 17'
  },
  {
    names: R.repeat('Hyrule Herb', 3).join(', '),
    hpRestore: hearts(6),
    _source: 'S1 Row 18'
  },
  {
    names: 'Swift Carrot, Fresh Milk, Rock Salt',
    hpRestore: hearts(2),
    _source: 'S1 Row 23'
  },
  {
    names: 'Bird Egg',
    hpRestore: hearts(2),
    _source: 'S1 Row 28'
  },
  {
    names: 'Sunshroom, Hylian Rice',
    hpRestore: hearts(3),
    _source: 'S1 Row 42'
  },
  {
    names: 'Spicy Pepper, Spicy Pepper, Sunshroom, Sizzlefin Trout',
    hpRestore: hearts(5),
    _source: 'S1 Row 59'
  },

  // HP Restore: the Nut Rule

  {
    _notes: { hpRestore: ['Nut Rule'] },
    names: 'Acorn',
    hpRestore: hearts(0.5),
    cook: {
      mats: [ Mat.ofName('Acorn') ],
      rcp: Rcp.ofName('Sautéed Nuts'),
      name: 'Sautéed Nuts',
      thumb: 'thumb-12-12.png',
      desc: 'These sautéed tree seeds are the perfect snack for the busy adventurer on the go!',
      effectData: 'no effect',
      hpRestore: 2,
      rupeePrice: 8
    }
  },
  {
    _notes: { hpRestore: ['Nut Rule'] },
    names: 'Acorn, Acorn, Acorn',
    hpRestore: hearts(0.5 * 3)
  },
  {
    _notes: { hpRestore: ['Nut Rule'] },
    names: 'Acorn, Acorn, Acorn, Acorn, Acorn',
    hpRestore: hearts(0.5 * 5)
  },
  {
    _notes: { hpRestore: ['Nut Rule'] },
    names: 'Chickaloo Tree Nut, Chickaloo Tree Nut',
    hpRestore: hearts(0.5 * 2)
  },
  {
    _notes: { hpRestore: ['Nut Rule', 'Important'] },
    names: 'Acorn, Chickaloo Tree Nut',
    hpRestore: hearts(1) + 4
  },
  {
    _notes: { hpRestore: ['Nut Rule'] },
    names: 'Hyrule Bass, Acorn, Hyrule Bass',
    hpRestore: hearts(4.5) + 2
  },
  {
    _notes: { hpRestore: ['Nut Rule'] },
    names: 'Acorn, Tabantha Wheat, Cane Sugar, Goat Butter',
    hpRestore: hearts(0.5 + 2 + 0 + 0) + 2
  },
  {
    _notes: { hpRestore: ['Nut Rule'] },
    names: 'Acorn, Spicy Pepper, Stamella Shroom',
    hpRestore: hearts(0.5 + 1 + 1) + 2
  },

  // getRecipeType
  { // Nothing
    names: '',
    _alias: '(nothing)',
    recipeType: 'Dubious'
  },

  // canCookInto

  { // Totally wrong
    names: 'Bird Egg',
    canCookInto: { false: ['Fruitcake'] }
  },
  { // Totally wrong; same number of ingredients
    names: 'Bird Egg, Bird Egg, Bird Egg, Bird Egg',
    canCookInto: { false: ['Fruitcake'] }
  },
  {
    names: 'Fresh Milk, Tabantha Wheat, Goat Butter, Hearty Blueshell Snail',
    canCookInto: { true: ['Clam Chowder'] }
  },
  {
    names: 'Hearty Durian, Cane Sugar, Apple, Tabantha Wheat',
    canCookInto: { true: ['Fruitcake'] }
  },
  {
    names: 'Goat Butter, Apple, Fresh Milk, Raw Gourmet Meat, Tabantha Wheat',
    canCookInto: { false: ['Prime Meat Stew'] },
    recipeType: 'Food'
  },
  {
    names: 'Goat Butter, Fresh Milk, Raw Bird Thigh, Tabantha Wheat',
    canCookInto: { true: ['Prime Meat Stew'] },
    recipeType: 'Food'
  },
  { // Additive Only Recipe
    names: 'Hylian Rice, Goron Spice, Monster Extract',
    canCookInto: { true: ['Monster Curry'] },
    recipeType: 'Food'
  },
  { // Additive Only Recipe: slightly off
    names: 'Hylian Rice, Tabantha Wheat, Monster Extract',
    canCookInto: { false: ['Monster Curry', 'Nutcake'] },
    recipeType: 'Dubious',
    getDishEffectInfo: 'no effect'
  },
  {
    names: 'Hylian Rice',
    getDishEffectInfo: 'no effect'
  },

  // getDishEffectInfo

  {
    names: 'Apple',
    getDishEffectInfo: 'no effect'
  },
  {
    names: 'Hearty Durian',
    getDishEffectInfo: {
      prefix: 'Hearty', fxType: 'points', points: 4, extraHearts: 4
    },
    _source: { getDishEffectInfo: 'Basic mechanics and data' }
  },
  {
    names: 'Silent Princess, Silent Princess',
    getDishEffectInfo: {
      prefix: 'Sneaky',
      fxType: 'timed',
      title: 'Stealth Up',
      potency: 30,
      tierNumber: 2,
      tierName: 'mid'
    },
    _source: { getDishEffectInfo: 'Memory/basic' }
  },
  {
    _notes: { getDishEffectInfo: ['Very hearty'] },
    names: 'Hearty Durian, Hearty Durian, Hearty Truffle, Hearty Truffle, Apple',
    getDishEffectInfo: {
      prefix: 'Hearty',
      fxType: 'points',
      points: 10,
      extraHearts: 10
    }
  }
];

// —————————————————————————————————————
// Tests: Helper Functions
// —————————————————————————————————————

/**
 * A helper function related to the matTestingSets variable above.
 * 
 * For example, if a testing set is { name: 'Acorn', hpRestore: 2 }, and
 * we want to test the CookingUtil.getHpRestore function, we would call:
 * `renderMatTests('hpRestore', CookingUtil.getHpRestore)`.
 * 
 * @param {string} testingProp The property name in the mat testing set.
 * @param {Function} testingFunc Function which takes mats, and possibly more,
 *  and returns a specified output.
 * 
 * @sig (string, (Mats[] -> any)) -> null
 */
const renderMatTests = (testingProp, testingFunc) => {
  // Get all matSets which have expected values for the specified prop
  R.filter(set => !(set[testingProp] === undefined))(matTestingSets)
    .forEach(set => {
      let testDesc = '';
      // If the testing set has notes for tests of this type, show them
      const hasNotes = (set._notes && set._notes[testingProp]);
      testDesc += hasNotes ? `[${set._notes[testingProp].join('][')}] ` : '';
      // Describe test by its alias unless otherwise specified
      const hasAlias = (set._alias);
      testDesc += hasAlias ? set._alias : set.names;
      // Describe output
      testDesc += ` => ${set[testingProp]}`;


      // console.log(itString);
      it(testDesc, () => {
        if (!exists(set[testingProp])) return false;

        // let actual, expected;
        const matNameArray = set.names.split(',').map(m => m.trim()).filter(s => s !== '');
        const matArray = matNameArray.map(m => Mat.ofName(m));

        // For most functions, which demand (mats) as an argument
        if (testingProp !== 'canCookInto') {
          const actual = testingFunc(matArray);
          const expected = set[testingProp];
          expect(actual).toEqual(expected);
        // For `canCookInto`, which demands (mats, rcp, options) as arguments
        } else {
          const expectTrueArr = ifExists(set[testingProp]['true']);
          const expectFalseArr = ifExists(set[testingProp]['false']);
          const testArr = (rcpNameArr, expectedValue) => {
            R.forEach(__, rcpNameArr)(rcpName => {
              const rcp = Rcp.ofName(rcpName);
              const actual = testingFunc(matArray, rcp);
              expect(actual).toEqual(expectedValue);
            });
          };
          if (exists(expectTrueArr)) {
            testArr(expectTrueArr, true);
          }
          if (exists(expectFalseArr)) {
            testArr(expectFalseArr, false);
          }
        }
      });
    });
};

// —————————————————————————————————————
// Tests: Drivers
// —————————————————————————————————————

/**
 * Tests related to the 'Mat' object, which represents a material.
 */
describe('Mat', () => {

  // —————————————————————————————————————
  describe('Instantiation/construction', () => {
    it('ofName: acorn', () => {
      const acorn = Mat.ofName('Acorn');
      expect(R.is(Mat, acorn)).toBe(true);
      expect(acorn.name).toEqual('Acorn');
    });

    it('ofName fails for misspelled input', () => {
      try {
        const x = Mat.ofName('oogey boogey ;)');
      } catch(err) {
        expect(true).toBe(true);
      }
    });

      // —————————————————————————————————————

    it('ofId: Naydra\'s Horn (id: 62)', () => {
      const naydrasHorn = Mat.ofId(62);
      expect(R.is(Mat, naydrasHorn)).toBe(true);
      expect(naydrasHorn.name).toEqual('Shard of Naydra\'s Horn');
    });

    it('ofId: Naydra\'s Horn w/ input "62"', () => {
      const naydrasHorn = Mat.ofId('62');
      expect(R.is(Mat, naydrasHorn)).toBe(true);
      expect(naydrasHorn.name).toEqual('Shard of Naydra\'s Horn');
    });

    it('ofId fails for misspelled input', () => {
      try { 
        const x = Mat.ofId("not quite a number");
      } catch (err) {
        expect(true).toBe(true);
      }
    });
  });
  // —————————————————————————————————————
});

/**
 * Tests related to the 'Rcp' object, which represents a recipe.
 * 
 * At the moment, there's just the one section: instantiation and construction.
 */
describe('Rcp', () => {

  it('TODO', () => {
    expect(true).toBe(true);
  });

  // —————————————————————————————————————
  describe('Instantiation/construction', () => {
    it('ofName: Fried Wild Greens', () => {
      const wildGreens = Rcp.ofName('Fried Wild Greens');
      expect(R.is(Rcp, wildGreens)).toBe(true);
      expect(wildGreens.name).toEqual('Fried Wild Greens');

      expect(wildGreens.idx).toEqual(expect.anything());
      expect(wildGreens.notes).toEqual(expect.anything());
      expect(wildGreens.ingredients).toEqual(expect.anything());
    });

  //   it('ofName fails for misspelled input', () => {
  //     try {
  //       const x = Mat.ofName('oogey boogey ;)');
  //     } catch (err) {
  //       expect(true).toBe(true);
  //     }
  //   });

  //   // —————————————————————————————————————

  //   it('ofId: Naydra\'s Horn (id: 62)', () => {
  //     const naydrasHorn = Mat.ofId(62);
  //     expect(R.is(Mat, naydrasHorn)).toBe(true);
  //     expect(naydrasHorn.name).toEqual('Naydra\'s Horn');
  //   });

  //   it('ofId: Naydra\'s Horn w/ input "62"', () => {
  //     const naydrasHorn = Mat.ofId('62');
  //     expect(R.is(Mat, naydrasHorn)).toBe(true);
  //     expect(naydrasHorn.name).toEqual('Naydra\'s Horn');
  //   });

  //   it('ofId fails for misspelled input', () => {
  //     try {
  //       const x = Mat.ofId("not quite a number");
  //     } catch (err) {
  //       expect(true).toBe(true);
  //     }
  //   });
  });
});

/**
 * Tests related to the individual functions of the rather large 'CookingUtil'
 * utility class. 
 * 
 * Many of the functions in this class take an array of Materials, or "mats",
 * as input. As such, many of these tests are represented as mat testing sets
 * which are described above and simply rendered in the describe blocks
 * immediately below.
 */
describe('CookingUtil', () => {
  describe('getRupeePrice', () => {
    const testingProp = 'rupeePrice';
    renderMatTests(testingProp, CookingUtil.getRupeePrice);
  });

  describe('getHpRestore', () => {
    const testingProp = 'hpRestore';
    renderMatTests(testingProp, CookingUtil.getHpRestore);
  });

  describe('canCookInto', () => {
    const testingProp = 'canCookInto';
    renderMatTests(testingProp, CookingUtil.canCookInto);
  });

  describe('getRecipeType', () => {
    const testingProp = 'recipeType';
    renderMatTests(testingProp, CookingUtil.getRecipeType);
  });

  describe('getDishEffectInfo', () => {
    const fn = CookingUtil.getDishEffectInfo;
    const testingProp = 'getDishEffectInfo';
    renderMatTests(testingProp, fn);
  });

  /**
   * The breadwinner of the CookingUtil is its function 'cook', which uses
   * all other functions in the class to calculate all details of the output
   * dish for an input array of one to five materials.
   * 
   * 
   */
  describe('CookingUtil.cook', () => {
    const fn = CookingUtil.cook;
    const testingProp = 'cook';
    renderMatTests(testingProp, fn);
  }); 
});

// —————————————————————————————————————
// Tests: Sandbox
// —————————————————————————————————————
/**
 * For quick and dirty tests. Tests for testing. Test-tests?
 */

it('sandbox', () => {
  // When it comes time to play, play here
});

// ——————————————————————————————

/*
  Other Notes:

  COMMON MISSPELLINGS

  Tabantha Wheat <-> Tanbantha Wheat
*/

// End of file