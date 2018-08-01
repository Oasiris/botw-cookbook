/**
 * Utilities relating to effects.
 */

// ——————————————————————————————————————————————————————————————————————————
// Dependencies
// ——————————————————————————————————————————————————————————————————————————

/**
 * C for 'Constants'.
 */
import C from '../data/all.json';
import isNumber from 'isnumber';
import R, { curry, compose, pipe, __ } from 'ramda';

import { exists, xor, match, arrayify, dearrayify, matchK } from './utility';

import { Mat, Rcp } from './CookingUtil';

// Node base modules
import assert from 'assert';

// ——————————————————————————————————————————————————————————————————————————
// Data Definitions: VS Code
// ——————————————————————————————————————————————————————————————————————————

 /**
  * @typedef {Object} EffectData
  * @prop {String} prefix
  * @prop {String} fxType
  * @prop {String=} title
  * @prop {Object=} timedData
 */

// ——————————————————————————————————————————————————————————————————————————
// Class
// ——————————————————————————————————————————————————————————————————————————


export default class EffectUtil {
  
  /**
  * @param {Mat[]} mats
  * @return String containing the name of the effect that the recipe made by 
  * cooking these ingredients would yield, or `"no effect"` if there is no net 
  * effect (occurs when there are either 0 or 2+ unique effects across all 
  * input ingredients.)
  */
  static getEffect(mats) {
    // const uniqueEffects = R.uniq(R.map(R.prop('effect'))(mats));
    const uniqueEffects = compose(
      R.filter(s => exists(s)), // Filter out 'null' and 'undefined'
      R.uniq(),
      R.map(R.prop('effect'))
    )(mats);
    return (uniqueEffects.length === 1) ? uniqueEffects[0] : 'no effect';
  }

  /**
   * @param {String} effectName Name of a food effect. E.g. "Energizing".
   * @return {EffectData} The data for that effect.
   */
  static getEffectData(effectName) {
    return C.effectData[effectName.toLowerCase()];
  }


  /** 
   * @param {Mat[]} mats 
   * @param {EffectData} effectData Name of a food effect. E.g. "Energizing".
   * @param {Mat[]} effContributors An array containing copies of all Mats that
   * directly contribute to the effect (e.g. Hearty materials for a Hearty
   * dish.)
   * @return {Number}
   */
  static getEffectDuration(
    mats, 
    effectData = EffectUtil.getEffectData(EffectUtil.getEffect(mats))
    ) {
    
    const effectName = effectData.prefix;
    const effContributors = R.filter(R.propEq('effect', effectName))(mats);

    // Assert effect is timed
    assert.equal(effectData.fxType, 'timed');

    // Base duration.
    const baseDuration = 30 * mats.length;

    // Contributor duration
    const { contribFactor } = effectData.timedData;
    const contribTimeBoost = contribFactor * effContributors.length;

    // Certain foods we call 'time boosters' because they add a flat amount of
    // time to an effect.
    const foodTimeBoost = compose(
      R.sum(),
      R.map(R.prop('time_boost')),
      R.filter(m => exists(m.time_boost))
    )(mats);

    // Monster parts, or 'reagants', are effect-agnostic. Each will add a flat
    // amount of time to the effect based on its "tier".
    const reagantTimeBoost = compose(
      R.sum,
      R.map(rank => C.reagantDurationBonuses[rank - 1]),
      R.map(m => Number(m.rank)),
      R.filter(R.propEq('usage', 'Monster Part'))
    )(mats);

    return baseDuration + contribTimeBoost + foodTimeBoost + reagantTimeBoost;
  }

  /**
   * @typedef {Object} PotencyData
   * @prop {String} tierName
   * @prop {Number} tierNumber
   * @prop {Number} potency
   */

  /**
   * Accepts one of two types of inputs:
   * - `mats`
   * - Additional `mats` and prevData
   * 
   * @param {*} mats
   * @param {EffectData} effectData
   * @param {PotencyData} prevData
   * @return {PotencyData}
   */
  static calcDishPotency(
    mats,
    effectData = EffectUtil.getEffectData(EffectUtil.getEffect(mats)),
    prevData = {}
    ) {
    if (!exists(prevData)) prevData = {};
    const hasPrevData = !R.equals(prevData, {});

    const { potencyLevels, tierBps } = effectData.timedData;

    const effectName = effectData.prefix;
    const effContributors = R.filter(R.propEq('effect', effectName))(mats);

    let potency = (hasPrevData) ? prevData.potency : 0;
    potency += compose(
      R.sum,
      R.map(p => potencyLevels[p - 1]),
      R.map(R.prop('potency'))
    )(effContributors);
    const tierNumber = EffectUtil.getTierFromPotency(potency, tierBps);
    const tierName = EffectUtil.getTierName(tierNumber);

    return { potency, tierNumber, tierName };
  }

  /**
   * @param {Number} potency 
   * @param {Number[]} tierBreakpoints 
   * @return {Number}
   * @example
   * // returns 1
   * EffectUtil.getTierFromPotency(2, [ 0, 5, 10 ])
   * @example
   * // returns 4
   * EffectUtil.getTierFromPotency(300, [ 0, 50, 120, 190 ])
   */
  static getTierFromPotency(potency, tierBreakpoints) {
    let idxes      = R.range(0, tierBreakpoints.length);
    let reverseBps = R.reverse(tierBreakpoints);
    let reverseIdx = R.reverse(idxes);
    for (let i in reverseBps) {
      const bp = reverseBps[i];
      if (potency >= bp) return reverseIdx[i] + 1;
    }
    return 1;
  }

  /**
   * @param {Number} tierNumber 
   * @return {String}
   */
  static getTierName(tierNumber) {
    const table = { '1': 'low', '2': 'mid', '3': 'high' };
    return table[tierNumber];
  }
  
}