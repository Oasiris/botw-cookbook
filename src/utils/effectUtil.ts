import assert from 'assert'
import { filter, map, pipe, prop, sum, uniq } from 'lodash/fp'

import data from '../data/all.json'
import {
    isPointsEffect,
    isTimedEffect,
    Compendium,
    Effect,
    MaterialEntry,
    TimedEffectEntry,
} from '../model/compendium'
import { DishEffect } from '../model/dishEffect'

import * as DataUtil from './dataUtil'

const DATA = (data as unknown) as Compendium

export function determineEffect(
    materials: MaterialEntry[],
    dishType: 'Food' | 'Elixir',
): DishEffect | null {
    const effectName = determineEffectName(materials)
    if (effectName === null) {
        return null
    }

    const effectContributors = materials.filter((mat) => mat.effect === effectName)
    // Should always be true because effectName is non-null.
    assert(effectContributors.length >= 1)

    if (isPointsEffect(effectName)) {
        // Sum the points on the direct effect contributors.
        const points = sum(materials.map(prop('potency')))
        const EFFECT_NAME_TO_BONUSES = {
            Hearty: { heartsExtra: points },
            Energizing: { staminaRestore: DATA.energizingLevels[points] },
            Enduring: { staminaExtra: DATA.enduringLevels[Math.min(points, 20)] },
        }
        return {
            name: effectName,
            desc: DataUtil.getEffectDescription(effectName, dishType),
            entry: DataUtil.getEffectEntry(effectName),
            ...EFFECT_NAME_TO_BONUSES[effectName],
        }
    } else if (isTimedEffect(effectName)) {
        const entry = DataUtil.getEffectEntry(effectName) as TimedEffectEntry

        // (1) Calculate effect duration.
        const baseDuration = 30 * materials.length
        const contributorTimeBoost = effectContributors.length * entry.timedData.contribFactor
        // Certain ingredients can add a flat amount to the effect duration. This boost can only
        // occur once per ingredient.
        const foodTimeBoost = pipe(
            filter((mat: MaterialEntry) => mat.time_boost !== undefined),
            uniq,
            map(prop('time_boost')),
            sum,
        )(materials)
        // Monster parts ("reagants") each add a flat amount of time to the effect, based on their tier.
        const reagantTimeBoost = pipe(
            filter((mat: MaterialEntry) => mat.usage === 'Monster Part'),
            map((mat: MaterialEntry) => DATA.reagantDurationBonuses[mat.rank! - 1]),
            sum,
        )(materials)
        const duration = baseDuration + contributorTimeBoost + foodTimeBoost + reagantTimeBoost

        // (2) Calculate effect potency and tier.
        const potency = sum(effectContributors.map(prop('potency')))
        let potencyTier = 1
        const POTENCY_TIER_BREAKPOINTS = entry.timedData.tierBps
        POTENCY_TIER_BREAKPOINTS.forEach((tierBreakpoint, tierIndex) => {
            if (potency >= tierBreakpoint) {
                potencyTier = tierIndex + 1
            }
        })
        const TIER_NUMBER_TO_TIER_NAME = { 1: 'low', 2: 'mid', 3: 'high' } as const
        const potencyTierName = TIER_NUMBER_TO_TIER_NAME[potencyTier as 1 | 2 | 3]

        // (3) Return.
        return {
            name: effectName,
            desc: DataUtil.getEffectDescription(effectName, dishType, potencyTierName),
            entry: DataUtil.getEffectEntry(effectName),
            title: entry.title,
            durationSeconds: duration,
            potencyLevel: potency,
            potencyTier: potencyTier as 1 | 2 | 3,
            potencyTierName,
        }
    } else {
        throw new Error('Unreachable code.')
    }
}

export function determineEffectName(materials: MaterialEntry[]): Effect | null {
    const uniqueEffects = uniq(
        materials.map(prop('effect')).filter((effectName) => effectName !== null),
    ) as Effect[]
    // The effect exists if there's exactly one unique effect among the ingredients.
    return uniqueEffects.length === 1 ? uniqueEffects[0] : null
}
