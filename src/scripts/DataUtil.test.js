/**
 * Testing file for DataUtil.
 */

// —————————————————————————————————————
// Dependencies
// —————————————————————————————————————

import CookingUtil, { Mat, Rcp } from './CookingUtil'

import R, { curry, compose, pipe, __ } from 'ramda';

import { exists, match, matchK, ifExists } from './utility'

// Important (get it? "Import"-ant?)
import DataUtil from './DataUtil'

// —————————————————————————————————————
// Tests
// —————————————————————————————————————

describe('basic', () => {
  it('exports correctly', () => {
    expect(exists(DataUtil)).toBe(true);
  });
});

describe('getEffectDesc', () => {
  const fn = DataUtil.getEffectDesc;  
  const inputOutputArr = [
    [
      ['Tough', 'mid', 'food'],
      'Grants a mid-level defense boost.'
    ], [
      ['Sneaky', 'high', 'food'],
      'Grants a high-level stealth boost.'
    ], [
      ['Electro', 'low', 'food'],
      'Grants low-level electricity resistance.'
    ], [
      ['Hearty', 'mid', 'elixir'],
      'Restores you to full health and increases your maximum hearts.' +
      ' The additional hearts are lost as you take damage.'
    ], [
      ['Sneaky', 'low', 'elixir'],
      'Grants a low-level stealth effect, which calms the nerves and ' +
      'silences footfalls. Allows you to move about undetected by ' +
      'monsters and animals.'
    ], [
      ['Fireproof', 'mid', 'elixir'],
      'Grants a fireproof effect, which prevents your body from ' +
      'catching fire. Be sure to pack this when venturing out to ' +
      'explore Death Mountain.'
    ]
  ];

  for (let inOut of inputOutputArr) {
    const [ inp, out ] = inOut;
    it(inp.join(', '), () => {
      expect(fn(...inp)).toEqual(out);
    });
  }

  // CUSTOM TEST
  it('Electro, low, food (calling function w/ default values)', () => {
    expect(DataUtil.getEffectDesc('Electro'))
      .toEqual('Grants low-level electricity resistance.');
  });
});

describe('getMatDesc', () => {
  const fn = DataUtil.getMatDesc;  
  const inputOutputArr = [
    [
      'Apple', 
      'A common fruit found on trees all around Hyrule. Eat it fresh,' + 
      ' or cook it to increase its effect.' 
    ], [
      'Warm Safflina', 
      'This medicinal plant grows in hot regions, such as the Gerudo Desert. ' +
      'It\'s warm to the touch and increases your cold resistance when cooked' +
      ' into a dish.'
    ], [
      'Big Hearty Radish',
      "This hearty radish has grown much larger than the average radish. It's" +
      " rich in analeptic compounds that, when cooked into a dish," + 
      " temporarily increase your maximum hearts."
    ], [
      "Icy Lizalfos Tail",
      "The severed tail of an Ice-Breath Lizalfos. Its hard scales and flesh" +
      " make it unsuitable for cooking, but it's perfect for making elixirs."
    ],
  ];
  for (let inOut of inputOutputArr) {
    const [inp, out] = inOut;
    it(`${inp} => ${out.slice(0, 40)}...`, () => {
      expect(fn(inp)).toEqual(out);
    });
  }
});

describe('getRcpBaseDesc', () => {
  const fn = DataUtil.getRcpBaseDesc;

  const expectedObj = {
    'Monster Curry': "This unusual take on curry uses monster extract and " +
      "doesn't rely on spices.",
    'Fairy Tonic': "This powerful recovery elixir harnesses the power of " + 
      "fairies. It has a sweet fragrance.",
  }

  it('Standard (no-duplicate) recipe: Monster Curry', () => {
    const rcpName = 'Monster Curry';
    expect(fn(rcpName)).toEqual(expectedObj[rcpName]);
  });

  describe('Recipe w/ dups: Fairy Tonic', () => {
    const rcpName = 'Fairy Tonic';
    const rcpIdxes = [ 114, 115, 116, 117 ];

    for (const idx of rcpIdxes) {
      it(`Fairy Tonic, idx no. ${idx}`, () => {
        const rcp = Rcp.ofId(idx);
        expect(fn(rcp)).toEqual(expectedObj[rcpName]);
      });
    }
  });
});