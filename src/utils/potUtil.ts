import {
    any,
    clone,
    curry,
    filter,
    find,
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

const DATA = data as unknown as Compendium

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
                hpRestore: determineHpRestore(materials, dishType),
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
                hpRestore: determineHpRestore(materials, dishType),
                rupeePrice,
            }
        case 'Elixir':
            // TODO: Finish 'Elixir' cooking
            const effectName = EffectUtil.determineEffectName(materials)!
            const elixirRecipe = DataUtil.getElixir(effectName)
            const elixirEffect = EffectUtil.determineEffect(materials, dishType)
            return {
                materials,
                recipe: elixirRecipe,
                dishType: 'Elixir',
                dishEffect: elixirEffect,
                name: elixirRecipe.name,
                desc: elixirEffect.desc,
                thumb: elixirRecipe.thumb,
                hpRestore: determineHpRestore(materials, dishType),
                rupeePrice,
            }
        case 'Food':
        default:
            // TODO: Finish 'Food' cooking
            // Traverse `recipes` in indexed order and find the first cooked dish here.
            const foodRecipe = find((rcp) => canCookRecipe(rcp, materials), DATA.recipes)!
            const foodEffect = EffectUtil.determineEffect(materials, dishType)
            const namePrefix = foodEffect ? `${foodEffect.name} ` : ''
            const descriptionSuffix = foodEffect ? ` ${foodEffect.desc}` : ''
            return {
                materials,
                recipe: foodRecipe,
                dishType: 'Food',
                dishEffect: foodEffect,
                name: namePrefix + foodRecipe.name,
                desc: foodRecipe.desc + descriptionSuffix,
                thumb: foodRecipe.thumb,
                hpRestore: determineHpRestore(materials, dishType, foodRecipe),
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
        const hasEffect = EffectUtil.determineEffectName(materials) !== null
        return hasEffect ? 'Elixir' : 'Dubious'
    } else {
        if (any(propEq('usage', 'Food'), materials)) {
            // If includes a nutritious ingredient, it's food.
            return 'Food'
        } else {
            // If it's only additives, it must cook into an additive-only recipe to be food.
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
                return validFamilies.some((family) => material.families.includes(family))
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
    const unusedMaterials = clone(uniq(materials))
    for (const ingred of recipe.ingredients) {
        // Find the first fulfilling ingredient.
        // const fulfillingMaterialIndex = findIndex(doesFulfillIngredient(ingred), unusedMaterials)
        const fulfillingMaterialIndex = unusedMaterials.findIndex(doesFulfillIngredient(ingred))
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

/** @returns How much HP the dish recovers. */
function determineHpRestore(mats: MaterialEntry[], dishType: 'Food', recipe: RecipeEntry): number
function determineHpRestore(materials: MaterialEntry[], dishType: Exclude<DishType, 'Food'>): number
function determineHpRestore(
    materials: MaterialEntry[],
    dishType: DishType,
    foodRecipe?: RecipeEntry,
): number {
    const baseRestore = sum(
        materials.map((material) => (material.hp !== undefined ? material.hp : 0)),
    )

    if (dishType === 'RockHard') {
        return 1
    } else if (dishType === 'Dubious') {
        return baseRestore / 2
    }

    // If the dish has a Hearty effect, it will provide full recovery.
    if (EffectUtil.determineEffectName(materials) === 'Hearty') {
        return Infinity
    }
    // Non-Hearty elixirs will never restore hearts.
    if (dishType === 'Elixir') {
        return 0
    }
    // Some recipes restore a set number of hearts.
    if (foodRecipe!.heartsRestore !== undefined) {
        return foodRecipe!.heartsRestore * 4
    }
    /*
     * Bonus hearts
     */
    let bonusRestore = 0
    // Recipes with bonus hearts:
    if (foodRecipe!.heartBonus !== undefined) {
        bonusRestore += foodRecipe!.heartBonus * 4
    }
    // Monster recipes:
    if (
        foodRecipe!.ingredients.some((ingred) => ingred[1] === 'Monster Extract') &&
        foodRecipe!.heartsAlwaysAffectedByExtract === true
    ) {
        bonusRestore += 3 * 4
    }
    // "Nut rule": +4 HP if incldues both types of nut
    //             +2 HP if includes one type of nut and one or more non-nuts
    const uniqueNuts = uniq(materials.filter((mat) => mat.families.includes('Nut')))
    const includesNonNut = materials.some((mat) => !mat.families.includes('Nut'))
    if (uniqueNuts.length === 2) {
        bonusRestore = 4
    } else if (uniqueNuts.length === 1) {
        bonusRestore = includesNonNut ? 2 : 0
    }

    return baseRestore + bonusRestore
}
