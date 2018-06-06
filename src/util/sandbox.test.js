/**
 * A place to test functions and logic in JavaScript.
 */

import R, { curry, compose, __ } from 'ramda'


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
});

