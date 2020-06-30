import { DubiousFoodEntry, Effect, ElixirEntry, MaterialEntry, RecipeEntry } from './compendium'
import { DishEffect } from './dishEffect'

export type DishType = 'Dubious' | 'RockHard' | 'Food' | 'Elixir'

export type Dish = {
    materials: MaterialEntry[]
    name: string
    desc: string
    thumb: string
    // Can be zero or positive.
    hpRestore: number
    rupeePrice: number
} & (DishDubious | DishRockHard | DishFood | DishElixir)

export type DishDubious = {
    recipe: DubiousFoodEntry
    dishType: 'Dubious'
    dishEffect: null
}

export type DishRockHard = {
    recipe: RecipeEntry
    dishType: 'RockHard'
    dishEffect: null
}

export type DishFood = {
    recipe: RecipeEntry
    dishType: 'Food'
    dishEffect: DishEffect | null
}

export type DishElixir = {
    recipe: ElixirEntry
    dishType: 'Elixir'
    dishEffect: DishEffect | null
}
