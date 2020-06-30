/*
 * Testing Suite
 */

import { all, any, negate, trim } from 'lodash/fp'

import { DubiousFoodEntry, ElixirEntry, MaterialEntry, RecipeEntry } from '../model/compendium'
import { Dish, DishType } from '../model/dish'
import { DishEffect } from '../model/dishEffect'
import * as DataUtil from '../utils/dataUtil'
import * as PotUtil from '../utils/potUtil'
import { ditto, exists } from '../utils/util'

type PotTestType = {
    input: string | string[]
    result: {
        dishType?: DishType
        name?: string
        desc?: string
        thumb?: string
        hpRestore?: number
        rupeePrice?: number
        recipe?: DubiousFoodEntry | RecipeEntry | ElixirEntry
        dishEffect?: Partial<DishEffect> | null
    }

    _source?: string
    _note?: string
}
const potTests: PotTestType[] = [
    {
        input: 'Raw Gourmet Meat',
        result: {
            dishType: 'Food',
        },
    },
    // Additive based testing sets
    {
        input: 'Fairy',
        result: {
            name: 'Fairy Tonic',
        },
    },

    /*
     * Tests from 2018: Alex Ren's dishes
     */
    {
        input: ditto(5, 'Palm Fruit'),
        result: {
            name: 'Simmered Fruit',
            hpRestore: 40,
        },
    },
    {
        input: 'Apple, Apple, Apple, Palm Fruit, Palm Fruit',
        result: {
            name: 'Simmered Fruit',
            hpRestore: 7 * 4,
        },
    },
    {
        input: 'Raw Gourmet Meat, Raw Gourmet Meat, Raw Gourmet Meat, Raw Gourmet Meat',
        result: {
            name: 'Meat Skewer',
            dishEffect: null,
            hpRestore: 24 * 4,
            desc: 'A juicy, filling snack made by grilling small chunks of meat on a skewer.',
        },
    },
    {
        input: 'Big Hearty Truffle',
        result: {
            name: 'Hearty Mushroom Skewer',
            hpRestore: Infinity, // Full recovery
            dishEffect: { name: 'Hearty', heartsExtra: 4 },
        },
    },
    {
        input: 'Big Hearty Radish, Big Hearty Radish',
        result: {
            name: 'Hearty Fried Wild Greens',
            hpRestore: Infinity,
            dishEffect: { name: 'Hearty', heartsExtra: 10 },
        },
    },
    {
        input:
            'Stamella Shroom, Stamella Shroom, Stamella Shroom, Stamella Shroom, Stamella Shroom',
        result: {
            name: 'Energizing Mushroom Skewer',
            hpRestore: 4 * 5,
            dishEffect: { name: 'Energizing', staminaRestore: 1.4 },
        },
    },
    {
        input:
            'Stamella Shroom, Stamella Shroom, Stamella Shroom, Stamella Shroom, Bright-Eyed Crab',
        result: {
            name: 'Energizing Fish and Mushroom Skewer',
            hpRestore: 4 * 6,
            dishEffect: { name: 'Energizing', staminaRestore: 1.6 },
        },
    },

    {
        input: 'Hightail Lizard',
        result: { name: 'Dubious Food' },
    },

    /*
     * Cemu save file test, from 2018
     */
    {
        input: 'Apple, Hylian Shroom, Hyrule Herb',
        result: {
            name: 'Steamed Mushrooms',
            hpRestore: 4 * 4,
            dishEffect: null,
        },
    },
    {
        input: 'Hot-Footed Frog, Hot-Footed Frog, Lizalfos Tail',
        result: {
            name: 'Hasty Elixir',
            hpRestore: 0,
            dishEffect: {
                name: 'Hasty',
                durationSeconds: 5 * 60 + 10,
                potencyTierName: 'low',
            },
        },
    },
    {
        input: 'Hightail Lizard, Bokoblin Horn',
        result: {
            name: 'Hasty Elixir',
            hpRestore: 0,
            dishEffect: {
                name: 'Hasty',
                title: 'Speed Up',
                potencyTierName: 'low',
                durationSeconds: 2 * 60 + 10,
            },
        },
    },
    {
        input: 'Fireproof Lizard, Fireproof Lizard, Bokoblin Horn',
        result: {
            name: 'Fireproof Elixir',
            hpRestore: 0,
            dishEffect: {
                name: 'Fireproof',
                title: 'Flame Guard',
                potencyTierName: 'low',
                durationSeconds: 6 * 60 + 10,
            },
        },
    },
    {
        input: 'Fireproof Lizard, Bokoblin Horn',
        result: {
            name: 'Fireproof Elixir',
            hpRestore: 0,
            dishEffect: { durationSeconds: 3 * 60 + 40 },
        },
    },
    /*
     * Cemu test — focus: seafood/crab/fish
     */
    {
        input: 'Hylian Rice, Bright-Eyed Crab',
        result: {
            name: 'Energizing Seafood Rice Balls',
            hpRestore: 4 * 4,
            dishEffect: { staminaRestore: 0.4 },
        },
    },
    {
        input: 'Hylian Rice, Hearty Blueshell Snail',
        result: {
            name: 'Hearty Seafood Rice Balls',
            hpRestore: Infinity,
            dishEffect: { heartsExtra: 3 },
        },
    },
    {
        input: 'Rock Salt, Razorclaw Crab',
        result: {
            name: 'Mighty Salt-Grilled Crab',
            hpRestore: 2 * 4,
            dishEffect: {
                potencyTier: 1,
                durationSeconds: 1 * 60 + 50,
            },
        },
    },
    {
        input: 'Rock Salt, Hearty Blueshell Snail',
        result: {
            name: 'Hearty Salt-Grilled Fish',
            hpRestore: Infinity,
            dishEffect: {
                heartsExtra: 3,
            },
        },
    },
    {
        input: 'Hearty Blueshell Snail, Razorclaw Crab, Ironshell Crab, Bright-Eyed Crab',
        result: {
            name: 'Copious Seafood Skewers',
            hpRestore: 12 * 4,
            dishEffect: null,
        },
    },
    {
        input: 'Chillfin Trout, Sizzlefin Trout, Voltfin Trout, Stealthfin Trout',
        result: {
            name: 'Copious Seafood Skewers',
            hpRestore: 8 * 4,
            dishEffect: null,
        },
    },
    {
        input: 'Hyrule Herb, Sneaky River Snail',
        result: {
            name: 'Sneaky Steamed Fish',
            hpRestore: 4 * 4,
            dishEffect: { potencyTier: 1, potencyTierName: 'low', durationSeconds: 2 * 60 + 30 },
        },
    },
    {
        input: 'Hearty Blueshell Snail',
        result: {
            name: 'Hearty Seafood Skewer',
            hpRestore: Infinity,
            dishEffect: { name: 'Hearty', heartsExtra: 3 },
        },
    },
    {
        input: 'Sizzlefin Trout',
        result: {
            name: 'Spicy Fish Skewer',
            hpRestore: 2 * 4,
            dishEffect: { name: 'Spicy', potencyTierName: 'low', durationSeconds: 2 * 60 + 30 },
        },
    },
    {
        input: 'Spicy Pepper, Ironshell Crab',
        result: {
            name: 'Pepper Seafood',
            hpRestore: 3 * 4,
            dishEffect: null,
        },
    },
    // Related to effect cancelling
    {
        input: 'Hydromelon, Voltfruit, Hearty Radish, Fresh Milk',
        result: {
            name: 'Creamy Heart Soup',
            hpRestore: 8 * 4,
            dishEffect: null,
        },
    },

    /*
     * Cooking recipes
     */
    // Unique ingredients when trying to make dishes of certain recipes
    {
        input: 'Tabantha Wheat, Cane Sugar, Apple, Apple',
        result: {
            name: 'Simmered Fruit',
            hpRestore: 4 * 4,
            dishEffect: null,
        },
        _source: 'Cemu direct test',
    },
    {
        input: 'Tabantha Wheat, Cane Sugar, Apple, Wildberry',
        result: {
            name: 'Fruitcake',
            hpRestore: 5 * 4,
            dishEffect: null,
        },
        _source: 'Cemu direct',
        _note: 'Fruitcake recipe: +1 heart bonus',
    },
]

/*
 * Run tests
 */

describe('PotUtil', () => {
    describe('cook()', () => {
        for (const { input, result } of potTests) {
            // Generate list of materials from 'input'.
            const materialNames = Array.isArray(input)
                ? input
                : input.split(',').map(trim).filter(exists)
            const materials = materialNames.map(DataUtil.getMaterial)
            if (!all(exists, materials)) {
                console.error(new Error(`Not all materials in list ${materialNames} are valid`))
                continue
            }

            describe(materialNames.join(', '), () => {
                if (result === undefined) {
                    throw new Error(`'result' is undefined`)
                }
                // Cook dish.
                const dish = PotUtil.cook(materials as MaterialEntry[])

                // Compare each field in 'result' to the cooked dish.
                for (const [field, expected] of Object.entries(result)) {
                    switch (field) {
                        case 'dishType':
                            it(`dishType: ${expected}`, () => expect(dish.dishType).toBe(expected))
                            break
                        case 'name':
                            it(`name: ${expected}`, () => expect(dish.name).toBe(expected))
                            break
                        case 'desc':
                            it(`desc: ${(expected as string).slice(0, 30)}...`, () =>
                                expect(dish.desc).toBe(expected))
                            break
                        case 'hpRestore':
                            it(`hpRestore: ${expected}`, () => {
                                expect(dish.hpRestore).toBeDefined()
                                expect(dish.hpRestore).toBe(expected)
                            })
                            break
                        case 'dishEffect':
                            // Test fields inside the object.
                            if (expected === null) {
                                it('dishEffect: null', () => expect(dish.dishEffect).toBe(null))
                            } else {
                                describe(`dishEffect:`, () => {
                                    for (const [fieldInner, expectedInner] of Object.entries(
                                        expected as DishEffect,
                                    )) {
                                        // @ts-ignore
                                        it(`${fieldInner}: ${expectedInner}`, () =>
                                            // @ts-ignore
                                            expect(dish.dishEffect[fieldInner]).toEqual(
                                                expectedInner,
                                            ))
                                    }
                                })
                            }
                            break
                        default:
                            it(`Unexpected field '${field}'`, () => `Unexpected field '${field}'`)
                    }
                }
            })
        }
    })
})
