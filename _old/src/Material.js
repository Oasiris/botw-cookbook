/**
 * The Material class.
 */

/* NPM Dependencies */
const R = require('ramda');

/* Dependencies */
const C = require('./../constants');
const U = require('./util');

/* Class definition */

class Material {
  
  /**
   * Constructor. Creates an material represented by the input String.
   * @param {String|Number|Object} descriptor Variable of one of the following 
   * types:
   *   - If it's a Number, treat it as an material ID.
   *   - If it's a String, treat it as the name of the material.
   *   - If it's an object, check if it has a 'name' or 'id' field and derive 
   *       the material from that information.
   */
  constructor(descriptor) {
    if (typeof descriptor === 'number') {
      Object.assign(this, Material.queryDataById(descriptor));
    } else if (typeof descriptor === 'string') {
      const isId = !isNaN(parseInt(descriptor));
      Object.assign(
        this,
        isId ? Material.queryDataById(descriptor) : Material.queryDataByName(descriptor)
      );
    } else {
      // TODO: Fix this
      throw new Error("Not yet implemented constructor of Material for objects");
    }

    // Get description
    let i = C.MATERIAL_DESCS.findIndex(m => this.name === m[0]);
    if (i === -1) {
      throw new Error(`Couldn't find Material description`);
    }
    this.description = C.MATERIAL_DESCS[i][1];

    // Get icon ID
    // TODO

    // Assign individual properties
    this.isNut = ['Acorn', 'Chickaloo Tree Nut'].includes(this.name);
    this.isHearty = this.name.length >= 6 && this.name.slice(0, 6) === 'Hearty';
  }

  /* Look-up methods */

  /**
   * Looks up the material's data and returns it as JSObj. 
   * @param {String} name The name of the material.
   * @return {Object} JSObj containing metadata for a material.
   */
  static queryDataByName(name) {
    let parsedName = U.properNounify(name); // proper-noun-ifies
    return R.find(R.propEq('name', parsedName), C.MATERIALS);
  }

  /**
   * Looks up the material's data and returns it as JSObj. 
   * @param {Number|String} id The ID of the material.
   * @return {Object} JSObj containing metadata for a material.
   */
  static queryDataById(id) {
    // eliminates trailing zeroes and whatnot
    if (typeof id === 'string') {
      id = parseInt(id);
    }
    return R.find(R.propEq('idx', id), C.MATERIALS);
  }
  
  /* Material-Recipe methods */

  /**
   * 
   * @param {Array<Material>} mArr 
   * @param {Name} rName 
   * @param {*} mustBeExact 
   */
  canCookInto(mArr, rName, mustBeExact = false) {

  }
}

// Test
console.log(Material.queryDataByName('Apple'));
console.log(Material.queryDataById('0040'));

console.log(new Material('apple'));
// Exports

module.exports = Material;