// See https://stackoverflow.com/questions/54838593.
export type Narrowable = string | number | boolean | undefined | null | void | {}

export const tuple = <T extends Narrowable[]>(...t: T) => t
