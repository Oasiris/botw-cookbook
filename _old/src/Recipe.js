/**
 * The Recipe class.
 */

/* NPM Dependencies */
const R = require('ramda');

/* Dependencies */
const Material = require('./Material');
const C = require('./../constants');
const U = require('./util');

/* Class definition */

class Recipe {

  /**
   * 
   * @param {Array<Material|Number|String>} materials 
   */
  constructor(materials) {
    // Make sure that the array has 5 or less materials
    if (materials.length > 5) {
      throw new Error(`Tried to construct Recipe w/ too many materials: ` +
        `${materials.length}`);
    }

    // Convert elements to Materials if not already
    materials.map(v => {
      if (typeof v === 'string' || typeof v === 'number') {
        // Meaning that the v is not 
        return new Material(v);
      } else if (typeof v === 'object') { // assume it's an object
        return v;
      } else {
        throw new Error(`Invalid material ${v}`);
      }
    });
  }

}

/* Exports */

module.exports = Recipe;