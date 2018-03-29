/* —————————————————————————————————————————————————————————————————————————— */
// NPM Dependencies
/* —————————————————————————————————————————————————————————————————————————— */

const assert = require('chai').assert;
const R = require('ramda');

// Other

let ddd = describe;
let __ = R.__;

/* —————————————————————————————————————————————————————————————————————————— */
// Units to test
/* —————————————————————————————————————————————————————————————————————————— */

const Material = require(`./../src/Material.js`);

/* —————————————————————————————————————————————————————————————————————————— */
// Testing Helper Functions
/* —————————————————————————————————————————————————————————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— */
// Tests
/* —————————————————————————————————————————————————————————————————————————— */

// ddd('Sanity check test', () => {
//   it('true is equal to !false', () => {
//     assert.equal(true, !false);
//   });
// });



ddd('static queryByName', () => {
  
  // Basic test
  it('basic', () => {
    const actual = Material.queryByName('Apple');
    const expected = {
      "idx": 3,
      "name": "Apple",
      "price": 3,
      "price_mon": null,
      "hp": 4,
      "effect": null,
      "rank": null,
      "potency": null,
      "crit_chance": 0,
      "type": "Fruit",
      "families": [
        "Fruit",
        "Cakey Fruit"
      ],
      "usage": "Food",
      "hp_raw": 2
    };
    assert.deepEqual(expected, actual);
  });

  // Capitalization works properly
  it('capitalization works properly', () => {
    // uncap
    assert.deepEqual(
      Material.queryByName('Acorn'),
      Material.queryByName('acorn')
    );
    
    // decap and overcap
    assert.deepEqual(
      Material.queryByName('hearty DURIAN'), 
      Material.queryByName('Hearty Durian')
    );
  });
});