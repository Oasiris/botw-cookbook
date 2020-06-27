import {
    any,
    clone,
    curry,
    filter,
    findIndex,
    get,
    map,
    pipe,
    prop,
    propEq,
    sum,
    uniq,
} from 'lodash/fp'

import data from '../data/all.json'
import {
    Compendium,
    IngredientEntry,
    MaterialEntry,
    MaterialFamily,
    RecipeEntry,
} from '../model/compendium'
import { Dish, DishType } from '../model/dish'

import * as DataUtil from './dataUtil'
import * as EffectUtil from './effectUtil'
import { arrayify, xor } from './util'

const DATA = (data as unknown) as Compendium

export function cook(materials: MaterialEntry[]): Dish {
    // Determine the recipe type.
    const dishType = determineDishType(materials)

    const rupeePrice = determineRupeePrice(materials, dishType)
    switch (dishType) {
        case 'Dubious':
            return {
                materials,
                dishType: 'Dubious',
                recipe: DATA.dubiousFood,
                name: DATA.dubiousFood.name,
                thumb: DATA.dubiousFood.thumb,
                desc: DATA.dubiousFood.desc,
                dishEffect: null,
                hpRestore: 0, // TODO: Replace with real HP restore value,
                rupeePrice,
            }
        case 'RockHard':
            const recipe = DataUtil.getRecipe(DataUtil.NAME_ROCK_HARD_FOOD)!
            return {
                materials,
                dishType: 'RockHard',
                recipe,
                name: recipe.name,
                thumb: recipe.thumb,
                desc: recipe.desc,
                dishEffect: null,
                hpRestore: 1,
                rupeePrice,
            }
        case 'Elixir':
            // TODO: Finish 'Elixir' cooking
            return {
                materials,
                recipe: DataUtil.getElixir('Energizing'),
                dishType: 'Elixir',
                dishEffect: 'TODO',
                name: 'TODO',
                desc: 'TODO',
                thumb: 'TODO',
                rupeePrice,
            }
        case 'Food':
        default:
            // TODO: Finish 'Food' cooking
            return {
                materials,
                recipe: DataUtil.getRecipe('Apple')!,
                dishType: 'Food',
                dishEffect: null,
                name: 'TODO',
                desc: 'TODO',
                thumb: 'TODO',
                rupeePrice,
            }
    }
}

/** @returns Either 'Dubious', 'RockHard', 'Food', or 'Elixir' depending on what dish the materials yield. */
function determineDishType(materials: MaterialEntry[]): DishType {
    // Contains wood or mineral. Higher priority than Dubious.
    if (any((mat) => ['Mineral', 'Wood'].includes(mat.type), materials)) {
        return 'RockHard'
    }
    const hasCritter = any(propEq('usage', 'Critter'), materials)
    const hasMonsterPart = any(propEq('usage', 'Monster Part'), materials)

    // Has monster part but no critter, or vice versa.
    if (xor(hasCritter, hasMonsterPart)) {
        return 'Dubious'
    } else if (hasCritter && hasMonsterPart) {
        // An elixir with no effect becomes Dubious Food.
        const hasEffect = EffectUtil.determineEffect(materials) !== null
        return hasEffect ? 'Elixir' : 'Dubious'
    } else {
        if (any(propEq('usage', 'Food'), materials)) {
            // If includes a nutritious ingredient, it's food.
            return 'Food'
        } else {
            // Has only additives, so it's only food if it cooks into an additive-only recipe.
            const hasMatchingRecipe = any(
                (recipe) => canCookRecipe(recipe, materials),
                DATA.additiveOnlyRecipes,
            )
            return hasMatchingRecipe ? 'Food' : 'Dubious'
        }
    }
}

/**
 * @returns True if a dish for the given recipe could be cooked with the given materials.
 */
function canCookRecipe(
    recipe: RecipeEntry,
    materials: MaterialEntry[],
    // isExact?: boolean,
): boolean {
    const doesFulfillIngredient = curry(
        (ingredient: IngredientEntry, material: MaterialEntry): boolean => {
            if (ingredient[0] === 'name') {
                return material.name === ingredient[1]
            } else {
                const validFamilies = arrayify(ingredient[1])
                return any((family) => material.families.includes(family), validFamilies)
            }
        },
    )

    // Handle uniq_ingred flag, a flag that is only used for "Copious" recipes.
    if (recipe.uniq_ingred === true) {
        const family = recipe.ingredients[0][1] as MaterialFamily
        // We can use a shortcut to check if this can be cooked.
        const uniqueIngredients = pipe(
            filter((material: MaterialEntry) => material.families.includes(family)),
            map(prop('name')),
            uniq,
        )(materials)
        return uniqueIngredients.length >= recipe.ingredients.length
    }

    // Compute for typical recipes.
    /** A temporary list of materials that will shorten in each loop iteration. */
    const unusedMaterials = clone(materials)
    for (const ingred of recipe.ingredients) {
        // Find the first fulfilling ingredient.
        const fulfillingMaterialIndex = findIndex(doesFulfillIngredient(ingred), unusedMaterials)
        if (fulfillingMaterialIndex === -1) {
            return false
        } else {
            unusedMaterials.splice(fulfillingMaterialIndex, 1)
        }
    }
    return true
}

/** @returns Rupee price for a valid Elixir or Food. */
function determineRupeePrice(materials: MaterialEntry[], dishType: DishType): number {
    if (dishType === 'Dubious' || dishType === 'RockHard') {
        return 2
    }
    // Exception for sole Acorn.
    if (materials.length === 1 && materials[0].name === 'Acorn') {
        return 8
    }
    const priceSum = pipe(get('price'), sum)(materials)
    const MULTIPLIER = DATA.priceMultipliers[materials.length]

    // Round to nearest 10 rupees.
    return Math.ceil((priceSum * MULTIPLIER) / 10) * 10
}

function determineHpRestore(materials: MaterialEntry[]): number {
    // TODO: Implement
    return 0
}
