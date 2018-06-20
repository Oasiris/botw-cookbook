/**
 * A place to test the utility functions provided in 'utility.js'.
 */

// —————————————————————————————————————
// Dependencies
// —————————————————————————————————————

import R, { curry, pipe, compose, __ } from 'ramda'
import { exists, xor, match, matchK } from './utility'

// —————————————————————————————————————
// Tests
// —————————————————————————————————————

describe('exists', () => {
  it('""', () => {
    expect(exists('b')).toBe(true);
    expect(exists(5)).toBe(true);
    expect(exists(false)).toBe(true);
    expect(exists(0)).toBe(true);
    expect(exists(null)).toBe(false);
    expect(exists(undefined)).toBe(false);
  });
});

describe('xor', () => {
  it('""', () => {
    expect(xor(true, true)).toBe(false);
    expect(xor(true, false)).toBe(true);
    expect(xor(false, true)).toBe(true);
    expect(xor(false, false)).toBe(false);
  });
});

describe('match', () => {
  it('exports correctly', () => {
    expect(exists(match)).toBe(true);
    
    // Example: given by Hajime Yamasaki Vukelic
    let input = match(50)
      .on(x => x < 0, () => 0)
      .on(x => x >= 0 && x <= 1, () => 1)
      .otherwise(x => x * 10);
    let expected = 500;
    expect(input).toBe(expected);
  });

});

describe('matchK', () => {
  it('match functionality works', () => {
    expect(exists(match)).toBe(true);

    // Example: given by Hajime Yamasaki Vukelic
    let input = matchK(50)
      .on(x => x < 0, () => 0)
      .on(x => x >= 0 && x <= 1, () => 1)
      .otherwise(x => x * 10);
    let expected = 500;
    expect(input).toBe(expected);
  });

  it('two vars', () => {
    expect(exists(match)).toBe(true);

    let input = matchK(50, 100)
      .on((x, y) => x > y, () => 0)
      .on((x, y) => x >= 0 && y <= 1, () => 1)
      .otherwise((x, y) => x + y + 3);
    let expected = 153;
    expect(input).toBe(expected);
  });

  // it('two vars and R.equals: an example of what not to do', () => {
  //   const a = 5;
  //   const b = 40;

  //   const actual = (a, b) => match(a, b)
  //     .on(R.equals(a * 8, b), 'You win')
  //     .otherwise(() => 'You lose');
  //   // const expected = 'You win';

  //   expect(actual(a, b)).toThrow();


  // });

});