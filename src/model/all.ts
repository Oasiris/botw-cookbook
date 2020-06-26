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
    dubiousFood: DubiousFoodEntry[]
    energizingLevels: number[]
    enduringLevels: number[]
    reagantDurationBonuses: [number, number, number]
    priceMultipliers: [number, number, number, number, number]
    effectDescriptions: Record<Effect, { foodDesc: string; elixirDesc: string }>
    effectData: Record<Effect, EffectEntry>
}

export type MaterialEntry = {
    idx: number
    name: string
    price: number
    price_mon: number | null

    type: MaterialType
    families: MaterialFamily[]
    usage: MaterialUsage

    hp: number
    hp_raw: number
    rank: MonsterPartRank | null
    effect: Effect | null
    potency: number | null
    crit_chance: number

    desc: string
    thumb: string
}

export type RecipeEntry = {
    idx: number
    name: string
    notes: string
    heartBonus?: number
    heartsRestore?: number // See "Honey Crepe"
    ingredients: IngredientEntry[]

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
    prefix: Effect
} & (
    | {
          fxType: 'points'
      }
    | {
          fxType: 'timed'
          title: string
          timedData: {
              tierBps: [number, number] | [number, number, number]
              potencyLevels: [number, number] | [number, number, number]
              contribFactor: number
          }
      }
)

export type Effect =
    | 'Hearty'
    | 'Energizing'
    | 'Enduring'
    | 'Sneaky'
    | 'Hasty'
    | 'Mighty'
    | 'Tough'
    | 'Spicy'
    | 'Chilly'
    | 'Electro'
    | 'Fireproof'

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
