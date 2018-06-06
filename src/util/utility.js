/**
 * Utility functions.
 */

/**
 * @param {any} x
 * @return False if the input variable is undefined or null. True otherwise.
 */
export function exists(x) { return (x !== undefined) && (x !== null); }

/**
 * @param {boolean} a
 * @param {boolean} b
 * @return True if exactly one of the two input booleans evaluates to true.
 */
export function xor(a, b) { return (a ? !b : b); }