/**
 * A place to test functions and logic in JavaScript.
 */

import R, { curry, compose, __ } from 'ramda'

describe('Boolean tests', () => {
  it('Empty object is truthy', () => {
    const bool = (!!{});
    expect(bool).toEqual(true);
  });

});

describe('Array tests', () => {
  /**
   * Like objects that aren't the same object won't be counted as equals in Array.prototype.includes.
   */
  it('`includes` and arrays of objects', () => {
    const arr = [ {a: 1}, {b: 2}, {c: 3} ];
    const ele = {a: 1};
    expect(arr.includes(ele)).toEqual(false);
  });

  /**
   * Reference index number as if it's a key
   */
  it('Reference index number as if by key', () => {
    const arr = [10, 11, 12, 13, 14];
    expect(arr[2]).toEqual(arr['2']);
  });
});

describe('ramda tests', () => {
  it('test 1', () => {
    const arr = [{ a: 4 }, { a: 7 }, { a: 10 }];
    const expected = [4, 7, 10];

    // const result1 = R.map(v => R.prop('a', v))(arr);
    const result1 = R.map(R.prop('a', R.__))(arr);
    expect(result1).toEqual(expected);
  });

  it ('test 2', () => {
    const arr = [{ a: 4 }, { a: 7 }, { a: 10 }];
    const expectedMap = [4, 7, 10];
    const expected = 4 + 7 + 10;

    const result1 = R.sum(R.map(R.prop('a'), arr));
    expect(result1).toEqual(expected);

    const result2 = compose(R.sum, R.map(R.prop('a'), __))(arr);
    expect(result2).toEqual(expected);

    const result3 = compose(R.sum, R.map(R.prop('a')))(arr);
    expect(result3).toEqual(expected);
  });

  it('test: R.cond', () => {
    const inputs = [
      [true, false],
      [true, true],
      [false, true],
      [true, false]
    ];
    // const fn1 = R.cond([
    //   [

    //   ], [

    //   ]

    // ]);
  });

  it('test: R.remove and __', () => {
    const removeOne = R.remove(__, 1, __);
    // console.log(removeOne(2, [1, 2, 3, 4, 5, 6, 7]));

    expect(removeOne(2, [1, 2, 3, 4, 5, 6, 7])).toEqual([1, 2, 4, 5, 6, 7]);
  });
});

