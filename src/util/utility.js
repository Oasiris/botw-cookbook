/**
 * General utility functions.
 * 
 * Functions that could be used in nearly any project, not just this specific
 * app, should go here.
 */

// Dependencies

import R from 'ramda'

/**
 * @param {any} x
 * @return False if the input variable is undefined or null. True otherwise.
 */
export function exists(x) { return (x !== undefined) && (x !== null); }

/**
 * @param {any} x
 * @param {any} val
 * @return x if x exists. Val otherwise.
 */
export function def(x, d) { return (exists(x)) ? x : d; }

/**
 * @param {any} x
 * @return False if the input variable is undefined or null. Input otherwise.
 */
export function ifExists(x) { return def(x, false); }
// export function ifExists(x) { return (exists(x)) ? x : false; }

/* —————————————————————————————————————— */

/**
 * @param {boolean} a
 * @param {boolean} b
 * @return True if exactly one of the two input booleans evaluates to true.
 */
export function xor(a, b) { return (a ? !b : b); }


/* —————————————————————————————————————— */
// Courtesy of https://codeburst.io/alternative-to-javascripts-switch-statement-with-a-functional-twist-3f572787ba1c

/**
 * TODO
 * 
 * For examples on how to use this, go to utility.test.js.
 * @param {*} x 
 */
export const match = x => ({
  on: (pred, fn) => (pred(x) ? matched(fn(x)) : match(x)),
  otherwise: fn => fn(x),
})

/**
 * TODO
 * @param {*} x 
 */
const matched = x => ({
  on: () => matched(x),
  otherwise: () => x,
})

/**
 * TODO
 * 
 * For examples on how to use this, go to utility.test.js.
 * @param {*} x 
 */
export const matchK = (...x) => ({
  on: (pred, fn) => (pred(...x) ? matchedK(fn(...x)) : matchK(...x)),
  otherwise: fn => fn(...x),
})

/**
 * TODO
 * @param {*} x 
 */
const matchedK = (...x) => ({
  on: () => matchedK(...x),
  otherwise: () => x,
})

/**
 * 
 * @param {Any} x 
 * @return x if x was already an array, or an array with the sole element x otherwise.
 */
export const arrayify = (x) => Array.isArray(x) ? x : [ x ]

/**
 * 
 * @param {Any} x 
 * @return The element at the 0th field of x if x is an array, or x otherwise.
 */
export const dearrayify = (x) => Array.isArray(x) ? x[0] : x