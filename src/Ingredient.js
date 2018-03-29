/**
 * This is the Ingredient class.
 */

 let foo = 'bar';

 let f = () => 'potatoes';

 class Ingredient {
  
  /**
   * Constructor. Creates an ingredient represented by the input String.
   * @param {String|Number|Object} descriptor Variable of one of the following 
   * types:
   *   - If it's a Number, treat it as an ingredient ID.
   *   - If it's a String, treat it as the name of the ingredient.
   *   - If it's an object, check if it has a 'name' or 'id' field and derive 
   *       the ingredient from that informatino.
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

  
  fillByName(name) {

  }

  // TODO: "ofName" method
  // TODO: "ofId" method

  /* Cache */


}

module.exports = Ingredient;