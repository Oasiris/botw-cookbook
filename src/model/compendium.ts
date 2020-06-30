// TODO: Thoroughly document this file with comments.

export type Compendium = {
    info: {
        materials: { length: number }
        recipes: { length: number }
    }
    materials: MaterialEntry[]
    recipes: RecipeEntry[]
    additiveOnlyRecipes: RecipeEntry[]
    elixirs: ElixirEntry[]
    dubiousFood: DubiousFoodEntry
    energizingLevels: number[]
    enduringLevels: number[]
    reagantDurationBonuses: [number, number, number]
    priceMultipliers: [number, number, number, number, number]
    effectDescriptions: Record<Effect, { foodDesc: string; elixirDesc: string }>
    effectData: Record<Effect, EffectEntry>
}

/**
 * Model for materials, or "ingredients", that are cooked to create dishes.
 */
export type MaterialEntry = {
    idx: number
    name: string
    price: number
    price_mon: number | null

    type: MaterialType
    families: MaterialFamily[]
    usage: MaterialUsage

    desc: string
    thumb: string

    /** The amount of HP that the ingredient restores _when included in a dish_. */
    hp: number
    hp_raw: number
    time_boost?: number
    crit_chance: number
} & (
    | EffectlessMaterialEntry
    | TimedEffectMaterialEntry
    | PointsEffectMaterialEntry
    | MonsterPartEntry
)

type EffectlessMaterialEntry = {
    effect: null
    rank: null
    potency: null
}

type TimedEffectMaterialEntry = {
    effect: TimedEffect
    rank: TimedEffectRank
    potency: number
}

type PointsEffectMaterialEntry = {
    effect: PointsEffect
    rank: null
    potency: number
}

type MonsterPartEntry = {
    effect: null
    rank: MonsterPartRank
    potency: null
}

/**
 * Information regarding recipes, or the blueprints to create food dishes.
 */
export type RecipeEntry = {
    idx: number
    name: string
    notes: string
    heartBonus?: number
    heartsRestore?: number // See "Honey Crepe"
    ingredients: IngredientEntry[]
    /** If `true`, all ingredients used in cooking this dish must be unique from one another. */
    uniq_ingred?: boolean
    /** If `true`, hearts restored will be boosted from the Monster Extract present in the recipe. */
    heartsAlwaysAffectedByExtract?: boolean

    desc: string
    thumb: string
}

export type IngredientEntry =
    | ['name', string]
    | ['family', MaterialFamily]
    | ['family', MaterialFamily[]]

export type ElixirEntry = {
    name: string
    thumb: string
    /* Note: the elexir descriptions can be found in the 'effectDescriptions' field in the Compendium. */
}

export type DubiousFoodEntry = {
    name: string
    desc: string
    thumb: string
}

export type EffectEntry = {
    name: Effect
} & (PointsEffectEntry | TimedEffectEntry)

export type PointsEffectEntry = {
    fxType: 'points'
}

export type TimedEffectEntry = {
    fxType: 'timed'
    title: string
    timedData: {
        tierBps: [number, number] | [number, number, number]
        potencyLevels: [number, number] | [number, number, number]
        contribFactor: number
    }
}

export type Effect = TimedEffect | PointsEffect

export type TimedEffect =
    | 'Sneaky'
    | 'Hasty'
    | 'Mighty'
    | 'Tough'
    | 'Spicy'
    | 'Chilly'
    | 'Electro'
    | 'Fireproof'
export type PointsEffect = 'Hearty' | 'Energizing' | 'Enduring'

export function isPointsEffect(effect: Effect): effect is PointsEffect {
    return ['Hearty', 'Energizing', 'Enduring'].includes(effect)
}

export function isTimedEffect(effect: Effect): effect is TimedEffect {
    return !isPointsEffect(effect)
}

export type MaterialType =
    // Foods
    | 'Fruit'
    | 'Shroom'
    | 'Radish'
    | 'Carrot'
    | 'Herb'
    | 'Veggie'
    | 'Red Meat'
    | 'Red Meat+'
    | 'Red Meat++'
    | 'Bird Meat'
    | 'Bird Meat+'
    | 'Bird Meat++'
    | 'Honey'
    | 'Ingredient'
    | 'Egg'
    | 'Milk'
    | 'Flower'
    | 'Seafood'
    | 'Fish'
    | 'Porgy'
    | 'Crab'
    | 'Mineral'

    // Additives
    | 'Nut'
    | 'Star Fragment'
    | 'Dragon Part'
    | 'Fairy'

    // Critters
    | 'Lizard'
    | 'Frog'
    | 'Insect'
    | 'Darner'
    | 'Butterfly'
    | 'Beetle'

    // Others
    | 'Monster Part'
    | 'Ancient Part'
    | 'Mineral'
    | 'Wood'

export type MaterialFamily =
    // Foods
    | 'Fruit'
    | 'Cakey Fruit'
    | 'Shroom'
    | 'Green'
    | 'Radish'
    | 'Veggie'
    | 'Carrot'
    | 'Flower'
    | 'Herb'
    | 'Meat'
    | 'Red Meat'
    | 'Bird Meat'
    | 'Regular Meat'
    | 'Prime Meat'
    | 'Gourmet Meat'
    | 'Ingredient'
    | 'Egg'
    | 'Milk'
    | 'Seafood'
    | 'Fish'
    | 'Porgy'
    | 'Snail'
    | 'Blueshell'
    | 'Crab'

    // Additives
    | 'Nut'
    | 'Star Fragment'
    | 'Dragon Part'
    | 'Fairy'

    // Critters
    | 'Critter'
    | 'Lizard'
    | 'Frog'
    | 'Insect'
    | 'Darner'
    | 'Butterfly'
    | 'Beetle'

    // Others
    | 'Monster Part'
    | 'Ancient Part'
    | 'Mineral'
    | 'Wood'

export type MaterialUsage =
    | 'Food'
    | 'Additive'
    | 'Critter'
    | 'Monster Part'
    | 'Not cooking!'
    | 'Lit fire!'

export type MonsterPartRank = 1 | 2 | 3
/** Rank for _materials_ that induce timed effects (not for a final dish's effect.) */
export type TimedEffectRank = 1 | 2 | 3
