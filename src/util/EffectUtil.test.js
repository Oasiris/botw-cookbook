/**
 * Testing file for DataUtil.
 */

// —————————————————————————————————————
// Dependencies
// —————————————————————————————————————

import CookingUtil, { Mat, Rcp } from './CookingUtil'

import R, { curry, compose, pipe, __ } from 'ramda';

import { exists, match, matchK, ifExists } from './utility'

import EffectUtil from './EffectUtil'

// —————————————————————————————————————
// Tests
// —————————————————————————————————————

describe('basic', () => {
  it('exports correctly', () => {
    expect(exists(EffectUtil)).toBe(true);
  });
});

describe('getEffect', () => {
  const fn = EffectUtil.getEffect;


  it('Hearty 1', () => {
    const mats = [ Mat.ofName('Hearty Durian') ];
    expect(fn(mats)).toEqual('Hearty');
  });

  it('Sneaky 1', () => {
    const mats = [ Mat.ofName('Silent Princess') ];
    expect(fn(mats)).toEqual('Sneaky');
  });

  it('Sneaky multiple', () => {
    const mats = [Mat.ofName('Silent Princess'), Mat.ofName('Stealthfin Trout')];
    expect(fn(mats)).toEqual('Sneaky');    
  });

  it('Sneaky with filler', () => {
    const mats = [
      Mat.ofName('Silent Princess'), Mat.ofName('Acorn'), 
      Mat.ofName('Stealthfin Trout'), Mat.ofName('Bird Egg')
    ];
    expect(fn(mats)).toEqual('Sneaky'); 
  });

  it('No effects', () => {
    const mats = [Mat.ofName('Goat Butter'), Mat.ofName('Fresh Milk'),
    Mat.ofName('Apple'), Mat.ofName('Bird Egg')];
    expect(fn(mats)).toEqual('no effect'); 
  });

  it('Colliding effects', () => {
    const mats = [Mat.ofName('Warm Safflina'), Mat.ofName('Electric Safflina')];
    expect(fn(mats)).toEqual('no effect');
  });


});

describe('getEffectData', () => {
  const fn = EffectUtil.getEffectData;

  it('Works', () => {
    const expected = {
      prefix: 'Enduring',
      fxType: 'points',
    };
    expect(fn('Enduring')).toEqual(expected);
  });
});

describe('getEffectDuration', () => {
  const fn = EffectUtil.getEffectDuration;

  it('Game as oracle 1', () => {
    // https://photos.app.goo.gl/mhSXPyi9jDpZvyfC9
    const mats = [
      Mat.ofName('Apple'), // +30 (base)
      Mat.ofName('Acorn'), // +30 (base); +20 (unique)
      Mat.ofName('Hylian Shroom'), // +30 (base)
      Mat.ofName('Raw Bird Drumstick'), // +30 (base)
      Mat.ofName('Mighty Carp') // +30 (base); +20 (contrib)
    ];
    const manual = (30) + (30 + 20) + (30) + (30) + (30 + 20);
    const expected = 190;

    expect(manual).toEqual(expected);
    expect(fn(mats)).toEqual(expected);
  });

  it('Game as oracle 2', () => {
    // ...
    const mats = [
      Mat.ofName('Razorshroom'), // +30 (base); +20 (contrib)
      Mat.ofName('Raw Meat'), // +30 (base)
      Mat.ofName('Hylian Rice'), // +30 (base); +30 (unique)
      Mat.ofName('Rock Salt'), // +30 (base); +30 (unique)
    ];
    const manual = (30 + 20) + (30) + (30 + 30) + (30 + 30);
    const expected = 3 * 60 + 20;

    expect(manual).toEqual(expected);
    expect(fn(mats)).toEqual(expected);
  });

  it('Game as oracle 3', () => {
    // https://photos.app.goo.gl/QhP1kbPVuPw5XoFH6
    const mats = [
      Mat.ofName('Hightail Lizard'), // +30 (base); +30 (contrib)
      Mat.ofName('Bokoblin Fang'), // +30 (base); +80 (T2 Reagant)
      Mat.ofName('Bokoblin Fang'), // +30 (base); +80 (T2 Reagant)
      Mat.ofName('Bokoblin Fang'), // +30 (base); +80 (T2 Reagant)
      Mat.ofName('Bokoblin Fang'), // +30 (base); +80 (T2 Reagant)
    ];
    const manual = (30 + 30) + 4 * (30 + 80);
    const expected = 8 * 60 + 20;

    expect(manual).toEqual(expected);
    expect(fn(mats)).toEqual(expected);
  });
});

describe('calcDishPotency', () => {
  const fn = EffectUtil.calcDishPotency;

  it('first: 4 fleet-lotus seeds', () => {
    const mats = R.repeat(Mat.ofName('Fleet-Lotus Seeds'), 4);
    const expected = {
      tierName: 'mid',
      tierNumber: 2,
      potency: 56
    };
    expect(fn(mats)).toEqual(expected);
  });
});

describe('getTierFromPotency', () => {
  const fn = EffectUtil.getTierFromPotency;

  it('Doc examples', () => {
    expect(fn(2, [0, 5, 10])).toBe(1);
    expect(fn(300, [0, 50, 120, 190])).toBe(4);
  });

  it('Breakpoint tests with generic breakpoint table', () => {
    const breakpointTable = [ 0, 15, 30, 100, 2000, 8000 ];
    const inpOutputArray = [
      { input: 0, expected: 1 },
      { input: 10, expected: 1 },
      { input: 14, expected: 1 },
      { input: 15, expected: 2 },
      { input: 16, expected: 2 },
      { input: 29, expected: 2 },
      { input: 30, expected: 3 },
      { input: 31, expected: 3 },
      { input: 150, expected: 4 },
      { input: 500, expected: 4 },
      { input: 2000, expected: 5 },
      { input: 5054, expected: 5 },
      { input: 8000, expected: 6 },
      { input: 9001, expected: 6 }
    ];

    inpOutputArray.forEach(({ input, expected }) => {
      expect(fn(input, breakpointTable)).toEqual(expected);
    });
  });
});