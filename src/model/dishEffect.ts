import { Effect, EffectEntry } from './compendium'

export type DishEffect = {
    name: Effect
    desc: string
    // thumb: string
    entry: EffectEntry
} & (DishTimedEffect | DishPointsEffect)

export type DishTimedEffect = {
    title: string
    durationSeconds: number
    potencyLevel: number
    potencyTier: 1 | 2 | 3
    potencyTierName: 'low' | 'mid' | 'high'
}

export type DishPointsEffect =
    | {
          name: 'Hearty'
          heartsExtra: number
      }
    | {
          name: 'Energizing'
          staminaRestore: number
      }
    | {
          name: 'Enduring'
          staminaExtra: number
      }
