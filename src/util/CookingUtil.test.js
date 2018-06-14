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
 * This is a big ol' array of inputs and expected outputs.
 * 
 * Comments here will reference multiple sources, abbreviated as S# for some
 * number #. Those can be found here:
 * 
 * * S0: `_old` test file.
 * * S1: Spreadsheet: ["Zelda: Breath of the Wild Recipes"](http://docs.google.com/spreadsheets/d/1LskydTTg92HeJpJnCTQxqxBL89Ebh6J6ZYQ5VQ40D-c)
 * * S2: Spreadsheet: ["BREATH OF THE WILD - RECIPES"](http://docs.google.com/spreadsheets/d/13Cvmddd5m3R0ht4ZmE1L4RRXqaPMPvLh7FoW4TKI7mk)
 */
const matSets = [
  /* From _old test file. */

  // Relating to calculating rupee price.

  {
    names: 'Raw Gourmet Meat, Raw Gourmet Meat, Raw Gourmet Meat, Raw Gourmet Meat',
    _alias: 'Raw Gourmet Meat x4',
    rupeePrice: 340,
  }, 
  {
    names: 'Raw Gourmet Meat, Raw Gourmet Meat, Raw Gourmet Meat, Raw Gourmet Meat, Raw Gourmet Meat',
    _alias: 'Raw Gourmet Meat x5',    
    rupeePrice: 490
  },
  {
    _notes: { rupeePrice: ['Edge case'] },
    names: 'Acorn',
    rupeePrice: 8
  },
  {
    names: 'Chickaloo Tree Nut',
    rupeePrice: 10
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
    hpRestore: hearts(0.5)
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
    canCookInto: { false: ['Prime Meat Stew'] }
  },
  {
    names: 'Goat Butter, Fresh Milk, Raw Bird Thigh, Tabantha Wheat',
    canCookInto: { true: ['Prime Meat Stew'] }
  },
];

// —————————————————————————————————————
// Tests: Drivers
// —————————————————————————————————————


it('sandbox', () => {
  const m20 = Mat.ofId(20);
  const m40 = Mat.ofId(40);
  const price = CookingUtil.getRupeePrice([m20, m40]);
});


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
      expect(naydrasHorn.name).toEqual('Naydra\'s Horn');
    });

    it('ofId: Naydra\'s Horn w/ input "62"', () => {
      const naydrasHorn = Mat.ofId('62');
      expect(R.is(Mat, naydrasHorn)).toBe(true);
      expect(naydrasHorn.name).toEqual('Naydra\'s Horn');
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
  // // —————————————————————————————————————

});

/**
 * 
 * @param {string} testingProp 
 * @param {Function} testingFunc 
 * @sig (string, (Mats[] -> any)) -> null
 */
const testA = (testingProp, testingFunc) => {
  // Get all matSets which have expected values for the specified prop
  R.filter(set => exists(set[testingProp]))(matSets)
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
      const matNameArray = set.names.split(',').map(m => m.trim());
      const matArray = matNameArray.map(m => Mat.ofName(m));
      
      matchK(matArray, testingProp)
        .on((_mats, prop) => prop === 'canCookInto', 
          (mats, prop) => {
            const expectTrueArr = ifExists(set[prop]['true']);
            const expectFalseArr = ifExists(set[prop]['false']);
            const testArr = (rcpNameArr, expectedValue) => {
              R.forEach(__, rcpNameArr)(rcpName => {
                const rcp = Rcp.ofName(rcpName);
                const actual = testingFunc(mats, rcp);
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
        )
        // For functions with signature (mats) => propValue
        .otherwise((mats, prop) => {
          const actual = testingFunc(mats);
          const expected = set[prop];
          expect(actual).toEqual(expected);
        });
    });
  });
};

describe('CookingUtil', () => {
  describe('getRupeePrice', () => {
    const testingProp = 'rupeePrice';
    testA(testingProp, CookingUtil.getRupeePrice);
  });

  describe('getHpRestore', () => {
    const testingProp = 'hpRestore';
    testA(testingProp, CookingUtil.getHpRestore);
  });

  describe('canCookInto', () => {
    const testingProp = 'canCookInto';
    testA(testingProp, CookingUtil.canCookInto);
  });
});


/*

COMMON MISSPELLINGS

Tabantha Wheat <-> Tanbantha Wheat
*/