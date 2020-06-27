/*
 * Testing Suite
 */

import { all, any, negate, trim } from 'lodash/fp'

import { MaterialEntry } from '../model/compendium'
import { Dish } from '../model/dish'
import * as DataUtil from '../utils/dataUtil'
import * as PotUtil from '../utils/potUtil'
import { ditto, exists } from '../utils/util'

type PotTestType = {
    input: string | string[]
    result: Partial<Dish>
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
    // Tests from 2018: Alex Ren's dishes
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
            // effectData: { prefix: 'Hearty', extraHearts: 4 },
        },
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
                            it(`desc: ${expected.slice(0, 30)}...`, () =>
                                expect(dish.desc).toBe(expected))
                            break
                        case 'hpRestore':
                            it(`hpRestore: ${expected}`, () => {
                                expect(dish.hpRestore).toBeDefined()
                                expect(dish.hpRestore).toBe(expected)
                            })
                            break
                        default:
                            it(`Unexpected field '${field}'`, () => `Unexpected field '${field}'`)
                    }
                }
            })
        }
    })
})
