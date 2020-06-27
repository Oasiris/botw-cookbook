/**
 * Functions in this file exist to retrieve data from `all.json` for use elsewhere.
 */

import { find, propEq } from 'lodash/fp'

import data from '../data/all.json'
import { Compendium, Effect, ElixirEntry, MaterialEntry, RecipeEntry } from '../model/compendium'

import { exists } from './util'

const DATA = (data as unknown) as Compendium

export const NAME_ROCK_HARD_FOOD = 'Rock-Hard Food'

export function getRecipe(identifier: string | number): RecipeEntry | null {
    // Identifier is either a string ("name") or number ("index").
    if (typeof identifier === 'string') {
        const recipeByName = find(propEq('name', identifier), DATA.recipes)
        return recipeByName !== undefined ? recipeByName : null
    } else {
        const recipeById = find(propEq('idx', identifier), DATA.recipes)
        return recipeById !== undefined ? recipeById : null
    }
}

export function getMaterial(identifier: string | number): MaterialEntry | null {
    // Identifier is either a string ("name") or number ("index").
    if (typeof identifier === 'string') {
        const materialByName = find(propEq('name', identifier), DATA.materials)
        return materialByName !== undefined ? materialByName : null
    } else {
        const materialById = find(propEq('idx', identifier), DATA.materials)
        return materialById !== undefined ? materialById : null
    }
}

export function getElixir(effect: Effect): ElixirEntry {
    return find((elixir) => elixir.name.startsWith(effect), DATA.elixirs)!
}
