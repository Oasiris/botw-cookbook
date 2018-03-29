/**
 * The Material class.
 */
/* Dependencies */
const C = require('./../constants');
const U = require('./util');
console.log(U);

// const MATERIALS = require('./../constants').MATERIALS;




let foo = 'bar';

let f = () => 'potatoes';


class Material {
  
  /**
   * Constructor. Creates an material represented by the input String.
   * @param {String|Number|Object} descriptor Variable of one of the following 
   * types:
   *   - If it's a Number, treat it as an material ID.
   *   - If it's a String, treat it as the name of the material.
   *   - If it's an object, check if it has a 'name' or 'id' field and derive 
   *       the material from that informatino.
   */
  constructor(descriptor) {
    if (typeof descriptor === 'number') {
      // do nothing
    }
    console.log(`Foo: ${foo}`);
    console.log(f());

    // TODO: 
  }

  /* Factory methods */

  /**
   * Looks up the material's data 
   * @param {String} name The name of the material.
   */
  static queryByName(name) {

  }

  // TODO: "ofName" method
  // TODO: "ofId" method

  /* Cache */


}

module.exports = Material;