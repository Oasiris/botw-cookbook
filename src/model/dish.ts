import { DubiousFoodEntry, Effect, ElixirEntry, MaterialEntry, RecipeEntry } from './compendium'
import { DishEffect } from './dishEffect'

export type Dish = {
    materials: MaterialEntry[]
    name: string
    desc: string
    thumb: string
    rupeePrice: number
} & (DishDubious | DishRockHard | DishFood | DishElixir)

export type DishDubious = {
    recipe: DubiousFoodEntry
    dishType: 'Dubious'
    hpRestore: number
    dishEffect: DishEffect | null
}

export type DishRockHard = {
    recipe: RecipeEntry
    dishType: 'RockHard'
    hpRestore: number
    dishEffect: DishEffect | null
}

export type DishFood = {
    recipe: RecipeEntry
    dishType: 'Food'
    hpRestore?: number
    dishEffect: DishEffect | null
}

export type DishElixir = {
    recipe: ElixirEntry
    dishType: 'Elixir'
    hpRestore?: 0
    // dishEffect: DishEffect
    dishEffect: DishEffect | 'TODO'
}
