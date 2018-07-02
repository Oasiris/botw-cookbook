/**
 * Data tests.
 */

// —————————————————————————————————————
// Dependencies
// —————————————————————————————————————

import bundler from './bundler';

import { exists, match, matchK, ifExists } from './../util/utility'

import R from 'ramda';

// —————————————————————————————————————
// Tests
// —————————————————————————————————————

describe('recipes', () => {

  it('all recipes are objects', () => {
    const { recipes } = bundler;
    recipes.forEach(recipe => {
      expect(typeof recipe).toBe('object');
    });
  });

});

describe('elixirs', () => {
  it('exists', () => {
    expect(exists(bundler.elixirs)).toBe(true);
  });

  it('has as many entries as there are effects', () => {
    const elixirNum = bundler.elixirs.length;
    const effectNum = Object.keys(bundler.effectData).length;

    expect(elixirNum).toEqual(effectNum);
  });
});

/**
 * Testing the exported variable 'additiveOnlyRecipes'.
 * 
 * Can be accessed as `bundler.additiveOnlyRecipes`.
 */
describe('additiveOnlyRecipes', () => {

  it('additiveOnlyRecipes was calculated correctly', () => {
    expect(bundler.additiveOnlyRecipes).not.toBe(undefined);
  });

  it('additiveOnlyRecipes is the correct length', () => {
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
    expect(bundler.additiveOnlyRecipes.length).toBe(aoRecipeNames.length);
  });
});

describe('item descriptions', () => {
  it('Every single recipe entry has a description', () => {
    const val = R.all(rcp => exists(rcp.desc), bundler.recipes);
    
    if (val === false) {
      // console.log(R.filter(rcp => !exists(rcp.desc), bundler.recipes));
    }

    expect(val).toBe(true);
    
  });
  it('Every material has a description', () => {
    const val = R.all(mat => exists(mat.desc), bundler.materials);
    
    if (val === false) {
      // console.log(R.filter(mat => !exists(mat.desc), bundler.materials));
    }
    
    expect(val).toBe(true);
    
  });
  // bundler.materials.forEach(e => {
  //   console.log(e.desc)
  //   if (e.desc === undefined) {
  //     console.log('UNDEFINED!!!');
  //     console.log(exists(e.desc));
  //   }
  // })
});

describe('thumbs', () => {

  describe('general', () => {
    // it('every material has a thumbnail', () => {
    //   bundler.materials.forEach(el => {
    //     expect(exists(el.thumb)).toBe(true);
    //   });
    // });

    // it('every recipe has a thumbnail', () => {
    //   bundler.recipes.forEach(el => {
    //     expect(exists(el.thumb)).toBe(true);
    //   });
    // });

    it('every elixir has a thumbnail', () => {
      bundler.elixirs.forEach(el => {
        expect(exists(el.thumb)).toBe(true);
      });
    });

  });

  describe('units', () => {
    it('thumbs works -- material -- Hightail Lizard', () => {
      const ele = bundler.materials.filter(m => m.name === 'Hightail Lizard');
      expect(ele.length).toBe(1);
      expect(ele[0].thumb).toBe('thumb-0-18.png');
    });

    it('thumbs works -- recipe -- Salt-Grilled Greens', () => {
      const ele = bundler.recipes.filter(m => m.name === 'Salt-Grilled Greens');
      expect(ele.length).toBe(1);
      expect(ele[0].thumb).toBe('thumb-3-8.png');
    });

    it('thumbs works -- recipe -- Herb Sauté', () => {
      const ele = bundler.recipes.filter(m => m.name === 'Herb Sauté');
      expect(ele.length).toBe(1);
      expect(ele[0].thumb).toBe('thumb-5-14.png');
    });
  });
  
});

// console.log(bundler.recipes.filter(m => m.name.indexOf('é') !== -1))