/**
 * Big testing file for Dish.
 */

// —————————————————————————————————————
// Dependencies
// —————————————————————————————————————

import CookingUtil, { Mat, Rcp } from './CookingUtil'
import CookedDish from './CookedDish'

import R, { curry, compose, pipe, __ } from 'ramda';

import { exists, match, matchK, ifExists } from './utility'

// —————————————————————————————————————
// Tests
// —————————————————————————————————————

describe('CookedDish', () => {
  it('exists', () => {
    expect(exists(CookedDish)).toBe(true);
  });

  it('...', () => {
    const acorn = Mat.ofName('Acorn');

    const a = [
      CookedDish.ofMats([acorn])
    ];
    console.log(a);

    expect(true).toBe(true);
  });
});

const someVar = {
  names: 'Acorn',
  cook: {
    mats: [Mat.ofName('Acorn')],
    rcp: Rcp.ofName('Sautéed Nuts'),
    name: 'Sautéed Nuts',
    thumb: 'thumb-12-12.png',
    desc: 'These sautéed tree seeds are the perfect snack for the busy adventurer on the go!',
    effectData: 'no effect',
    hpRestore: 2,
    rupeePrice: 8
  }
};