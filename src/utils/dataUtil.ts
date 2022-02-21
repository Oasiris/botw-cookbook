/**
 * Utility functions. Each fetches specific data from `all.json`.
 */

import { find, propEq } from 'lodash/fp'

import data from '../data/all.json'
import {
    isPointsEffect,
    isTimedEffect,
    Compendium,
    Effect,
    EffectEntry,
    ElixirEntry,
    MaterialEntry,
    PointsEffect,
    RecipeEntry,
    TimedEffect,
} from '../model/compendium'

// import { exists } from './util'

const DATA = data as unknown as Compendium

export const NAME_ROCK_HARD_FOOD = 'Rock-Hard Food'

/**
 * @returns The recipe as a RecipeEntry for the given dish name/ID.
 */
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

/**
 * @returns The material as a MaterialEntry for the given material name/ID.
 */
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

/**
 * @returns The elixir as an ElixirEntry for the given effect name.
 */
export function getElixir(effect: Effect): ElixirEntry {
    return find((elixir) => elixir.name.startsWith(effect), DATA.elixirs)!
}

/**
 * @returns The effect entry for the given effect name.
 */
export function getEffectEntry(effect: Effect): EffectEntry {
    return DATA.effectData[effect]
}

export function getEffectDescription(effect: PointsEffect, dishType: 'Elixir' | 'Food'): string
export function getEffectDescription(
    effect: TimedEffect,
    dishType: 'Elixir' | 'Food',
    tierName: 'low' | 'mid' | 'high',
): string
export function getEffectDescription(
    effect: Effect,
    dishType: 'Elixir' | 'Food',
    tierName?: 'low' | 'mid' | 'high',
): string {
    const baseDescription =
        dishType === 'Elixir'
            ? DATA.effectDescriptions[effect].elixirDesc
            : DATA.effectDescriptions[effect].foodDesc
    if (isTimedEffect(effect)) {
        return baseDescription.replace(effect, tierName!)
    } else {
        return baseDescription
    }
}
