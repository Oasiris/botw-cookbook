/**
 * Utilities relating to the data, but not directly related to cooking logic.
 * 
 * Contains methods that do things like retrieving the description for a
 * material or recipe.
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

// ——————————————————————————————————————————————————————————————————————————
// Class
// ——————————————————————————————————————————————————————————————————————————


export default class DataUtil {

  /**
   * @param {*} effectName Name of an effect. Example: 'Energizing'.
   * @param {*} tierName Name of the effect's tier. Either 'low', 'medium', 
   * or 'high'. Default 'low'.
   * @param {*} rcpType Either 'food' or 'elixir'. Default 'food'.
   * @return {String} Effect-specific recipe description, to be appended to the
   * base recipe description.
   */
  static getEffectDesc(effectName, tierName = 'low', rcpType = 'food') {
    return C.effectDescriptions[effectName.toLowerCase()][rcpType.toLowerCase() + 'Desc']
      .replace('%s', tierName);
  }

  /**
   * Returns the description of the input material. The input can be either a 
   * Mat object or a name referring to said Mat.
   * 
   * @param {Mat|String} mat The Mat for which to retrieve a name, or the 
   * name of the material for which to retrieve a description.
   * @return {String} The description for the described material.
   */
  static getMatDesc(mat) {
    if (!exists(mat))
      throw new Error(`Invalid input "${mat}": must be Mat or mat name`);

    if (R.is(Mat, mat)) {
      return mat.desc;
    } else if (R.is(String, mat)) {
      // Get material with name property equal to input string
      const matObj = R.find(R.propEq('name', mat), C.materials);
      if (!exists(matObj))
        throw new Error(`Invalid mat name "${mat}".`);
      return matObj.desc;
    } else {
      throw new Error(`Invalid input type "${typeof mat}": must be Mat or mat name`);
    }
  }

  /**
   * Returns the description of the input material. The input can be either a 
   * Rcp object or a name referring to said Rcp.
   * 
   * @param {Rcp|String} rcp The Rcp for which to retrieve a name, or the 
   * name of the recipe for which to retrieve a description.
   * @return {String} The base description for the described recipe.
   */
  static getRcpBaseDesc(rcp) {
    if (!exists(rcp))
      throw new Error(`Invalid input "${rcp}": must be Rcp or rcp name`);

    if (R.is(Rcp, rcp)) {
      return rcp.desc;
    } else if (R.is(String, rcp)) {
      if (rcp.includes('Elixir')) return ''; // Elixirs have no base description
      // Get recipe with name property equal to input string
      const rcpObj = R.find(R.propEq('name', rcp), C.recipes);
      if (!exists(rcpObj))
        throw new Error(`Invalid rcp name "${rcp}".`);
      return rcpObj.desc;
    } else {
      throw new Error(`Invalid input type "${typeof rcp}": must be Rcp or rcp name`);
    }
  }
}