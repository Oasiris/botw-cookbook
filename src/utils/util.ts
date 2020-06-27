import { times } from 'lodash'
import { constant } from 'lodash/fp'

export function xor(a: boolean, b: boolean): boolean {
    return (a && !b) || (!a && b)
}

/** @returns Whether or not the value is not null or undefined. */
export const exists = <T>(value: T): value is NonNullable<T> =>
    value !== undefined && value !== null

export function arrayify<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value]
}

export function repeat<T>(num: number, value: T): T[] {
    return times(num, constant(value))
}

/** Repeats the string `num` times, separated by commas or a custom delimiter. */
export function ditto<T>(num: number, value: string, delimiter: string = ', '): string {
    return repeat(num, value).join(delimiter)
}
