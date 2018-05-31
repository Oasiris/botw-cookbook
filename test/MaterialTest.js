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

/* ——— static queryDataByName ——— */

ddd('static queryDataByName', () => {
  // Basic test
  it('basic', () => {
    const actual = Material.queryDataByName('Apple');
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
      Material.queryDataByName('Acorn'),
      Material.queryDataByName('acorn')
    );
    
    // decap and overcap
    assert.deepEqual(
      Material.queryDataByName('hearty DURIAN'),
      Material.queryDataByName('Hearty Durian')
    );
  });
});

/* ——— static queryDataById ——— */

ddd('static queryDataById', () => {
  // Basic test
  it('basic', () => {
    const actual = Material.queryDataById(3);
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

  // String vs number input
  it('string vs number input', () => {
    assert.deepEqual(
      Material.queryDataById('7'),
      Material.queryDataById(7)
    );
  });

  // Trailing zeroes
  it('trailing zeroes input', () => {
    assert.deepEqual(
      Material.queryDataById(40),
      Material.queryDataById('0040')
    )
  })
});

/* ——— constructor ——— */



// end of tests
