/**
 * Various utility functions.
 */

import times from 'lodash/times'
import constant from 'lodash/fp/constant'

// ————————————————
// Logic
// ————————————————

/**
 * @returns `true` iff exactly one of the inputted boolean values is `true`.
 */
export function xor(a: boolean, b: boolean): boolean {
    return (a && !b) || (!a && b)
}

/**
 * @returns Whether or not the value is not null or undefined.
 */
export const exists = <T>(value: T): value is NonNullable<T> =>
    value !== undefined && value !== null

// ————————————————
// Lists
// ————————————————

/**
 * @returns An array consisting of the given value `num` times.
 */
export function repeat<T>(num: number, value: T): T[] {
    return times(num, constant(value))
}

/**
 * @returns The original value if it was an array; otherwise, returns a list whose singular element
 * is the original value.
 */
export function arrayify<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value]
}

// ————————————————
// String
// ————————————————

/**
 * @returns The given string repreated `num` times, separated by commas or a custom delimiter.
 */
export function ditto(num: number, value: string, delimiter: string = ', '): string {
    return repeat(num, value).join(delimiter)
}
