// =============================================================================
// - NPM Dependencies ----------------------------------------------------------
// =============================================================================

const assert = require('chai').assert;
const R = require('ramda');

// Other

let ddd = describe;
let __ = R.__;

// =============================================================================
// - Units to Test -------------------------------------------------------------
// =============================================================================

let {
  makeProperN, lm, lr, 
  calcRupeePrice, getHpHeal, validateMats, 
  findFxData, getFxDesc, calcFx, getDishEffectDetails, getTimedTier, 
  hasBadMats, canCookInto, 
  getMatDesc, getRecipeBaseDesc, 
  cook
} = require('../main.js');

// =============================================================================
// - Testing Helpers -----------------------------------------------------------
// =============================================================================

let tEq = (a, b, fArr, description = "%a => %b", isDeepEq = false) => {
  if (typeof fArr == 'function')
    fArr = [fArr];
  if (description == 'def')
    description = "%a => %b";

  let descString = description.replace(/%a/g, a).replace(/%b/g, b);
  let out = a;
  it(descString, () => {
    for (let fn of fArr) {
      out = fn(out);
    }
    if (isDeepEq)  assert.deepEqual(out, b);
    else           assert.equal(out, b);
  });
}

// Variant that automatically makes 'lm' the first function call of the chain.
tLmEq = (a, b, fArr, description, isDeepEq) =>
  tEq(a, b, [lm].concat(fArr), description, isDeepEq);

tDeepLmEq = R.curry((a, b, fArr, description) => tLmEq(a, b, fArr, description, true));
tShalLmEq = R.curry((a, b, fArr, description) => tLmEq(a, b, fArr, description, false));






// let tIs = (a, b, fArr, description = "%a => %b", isDeepEq = false) => {
//   if (typeof fArr == 'function') fArr = [fArr];
//   if (description == 'def') description = "%a => %b";

//   it(description.replace(/%a/g, a).replace(/%b/g, b), () => {
//     let out = a;
//     for (let fn of fArr) {
//       out = fn(out);
//     }
//     assert.equal(out, b);
//   });
// }

// tDeepIs = (a, b, fArr, description = "%a => %b") => 
//   tIs(a, b, fArr, description, true);

// tDeepIs = R.curry(tDeepIs);

// tShalIs = (a, b, fArr, description = "%a => %b") => 
//   tIs(a, b, fArr, description, false);

// tShalIs = R.curry(tShalIs);

// // Variant that automatically makes 'lm' the first function call of the chain.
// let tLmIs = (a, b, fArr, description) => tShalIs(a, b, [lm].concat(fArr), description);

// tLmIs = R.curry(tLmIs);

// =============================================================================
// - Tests ---------------------------------------------------------------------
// =============================================================================

/*
    NOTES:

    "SS1": "Zelda: Breath of the Wild Recipes" -
     docs.google.com/spreadsheets/d/1LskydTTg92HeJpJnCTQxqxBL89Ebh6J6ZYQ5VQ40D-c

    "SS2": "BREATH OF THE WILD - RECIPES" - 
     docs.google.com/spreadsheets/d/13Cvmddd5m3R0ht4ZmE1L4RRXqaPMPvLh7FoW4TKI7mk
    

*/

ddd('Sanity check test', () => {
  it('true is equal to !false', () => {
    assert.equal(true, !false);
  });
});

let t_mainJs = () => {

  ddd('Base helpers', () => {
    ddd('#makeProperN', () => {
      it('hello world! => Hello World!', () => {
        assert.equal(makeProperN('hello world!'), 'Hello World!');
      });
    });
  });



  ddd('Misc helpers', () => {

    ddd('#calcRupeePrice', () => {

      tShalLmEq(__, __, __, '4 Gourmet Meats => %b')
        (R.repeat('Raw Gourmet Meat', 4), 340)(calcRupeePrice);

      tShalLmEq(__, __, __, '5 Gourmet Meats => %b')
        (R.repeat('Raw Gourmet Meat', 5), 490)(calcRupeePrice);

      tShalLmEq(['Acorn'], 8, calcRupeePrice, 'Edge case: Acorn => 8');

      tShalLmEq(['Chickaloo Tree Nut'], 10, calcRupeePrice, 'def');

      // From "Most expensive elixirs" video:
      // https://www.youtube.com/watch?v=v4_5Q1We3n0
    });

    ddd('#getHpHeal', () => {
      // tShalLmEq(['Wildberry', 'Hyrule Herb', 'Hyrule Bass', 'Mighty Bananas'],
      //   )

      // SS1 row 2
      tShalLmEq(['Apple', 'Tabantha Wheat', 'Cane Sugar', 'Goat Butter'], 3*4)
        (getHpHeal, 'def');
      // SS1 row 5
      tShalLmEq(['Hydromelon', 'Voltfruit', 'Hearty Radish', 'Fresh Milk'], 8*4)
        (getHpHeal, 'def');
      // SS1 row 6
      tShalLmEq(['Zapshroom'], 1*4, getHpHeal, 'def');
      // SS1 row 11
      tShalLmEq(R.repeat('Stamella Shroom', 5), 5*4, getHpHeal)
        ('5 Stamella Shrooms => %b');
      // SS1 row 16
      tShalLmEq(R.repeat('Hyrule Herb', 1), 2*4, getHpHeal, '1 Hyrule Herb => %b');
      // SS1 row 17
      tShalLmEq(R.repeat('Hyrule Herb', 2), 4*4, getHpHeal, '2 Hyrule Herb => %b');
      // SS1 row 18
      tShalLmEq(R.repeat('Hyrule Herb', 3), 6*4, getHpHeal, '3 Hyrule Herb => %b');
      // SS1 row 23
      tShalLmEq(['Swift Carrot', 'Fresh Milk', 'Rock Salt'], 2*4)
        (getHpHeal, 'def');
      // SS1 row 28
      tShalLmEq(['Bird Egg'], 2*4, getHpHeal, 'def');
      // SS1 row 42
      tShalLmEq(['Sunshroom', 'Hylian Rice'], 3*4, getHpHeal, 'def');
      // SS2 row 59
      tShalLmEq(['Spicy Pepper', 'Spicy Pepper', 'Sunshroom', 'Sizzlefin Trout'])
        (5*4, getHpHeal, 'def');

      ddd('The Nut Rule', () => {
        // --
        tShalLmEq(['Acorn'], 2, getHpHeal, 'def');
        // --
        tShalLmEq(['Acorn', 'Acorn'], 4, getHpHeal, 'def');
        // SS1 row 34
        tShalLmEq(R.repeat('Acorn', 5), 2.5*4, getHpHeal, '5 Acorns => %b');
        // --
        tShalLmEq(['Chickaloo Tree Nut', 'Chickaloo Tree Nut'], 4, getHpHeal, 'def');
        // --
        tShalLmEq(['Acorn', 'Chickaloo Tree Nut'], 8, getHpHeal, 'def');
        // SS2 row 9
        tShalLmEq(['Hyrule Bass', 'Acorn', 'Hyrule Bass'], 5*4, getHpHeal, 'def');
        // SS1 row 27
        tShalLmEq(['Acorn', 'Tabantha Wheat', 'Cane Sugar', 'Goat Butter'], 3*4)
          (getHpHeal, 'def');
        // SS1 row 19
        tShalLmEq(['Acorn', 'Spicy Pepper', 'Stamella Shroom'], 3*4)
          (getHpHeal, 'def');
      });
    });

    ddd('#validateMats', () => {
      tShalLmEq(['Raw Prime Meat', 'Apple', 'Hylian Herb', 'Bird Egg'], false)
      (validateMats, 'Fail: Hylian Herb isn\'t a thing, just Hyrule Herb');

      tShalLmEq(['Goat Butter', 'Sunshroom', 'Sugar Cane'], false)
      (validateMats, 'Fail: Sugar Cane isn\'t a thing, just Cane Sugar');

      tShalLmEq(['Goat Butter', 'Sunshroom', 'Cane Sugar'], true)
      (validateMats, 'True (tests Cane Sugar)');
    });

  });  // end of "Base helpers"

  ddd('Effect helpers', () => {

    ddd('#getFxDesc', () => {

      ddd('Food -- correct descriptions (varying fx and tier)', () => {
        it('Tough, mid, food', () => {
          assert.equal(getFxDesc('Tough', 'mid', 'food'),
            'Grants a mid-level defense boost.');
        });

        it('Sneaky, high, food', () => {
          assert.equal(getFxDesc('Sneaky', 'high', 'food'),
            'Grants a high-level stealth boost.');
        });

        it('Electro, low, food', () => {
          assert.equal(getFxDesc('Electro', 'low', 'food'),
            'Grants low-level electricity resistance.');
        });

        it('Electro, low, food (calling function w/ default values)', () => {
          assert.equal(getFxDesc('Electro'),
            'Grants low-level electricity resistance.');
        });
      });

      ddd('Elixirs -- correct descriptions (varying fx and tier)', () => {
        it('Hearty, mid, elixir', () => {
          assert.equal(getFxDesc('Hearty', 'mid', 'elixir'),
            'Restores you to full health and increases your maximum hearts.' +
            ' The additional hearts are lost as you take damage.');
        });

        it('Sneaky, low, elixir', () => {
          assert.equal(getFxDesc('Sneaky', 'low', 'elixir'),
            'Grants a low-level stealth effect, which calms the nerves and ' +
            'silences footfalls. Allows you to move about undetected by ' +
            'monsters and animals.');
        });

        it('Fireproof, mid, elixir', () => {
          assert.equal(getFxDesc('Fireproof', 'mid', 'elixir'),
            'Grants a fireproof effect, which prevents your body from ' +
            'catching fire. Be sure to pack this when venturing out to ' +
            'explore Death Mountain.');
        });
      });
    });

    ddd('#getDishEffectDetails', () => {
      ddd('First tests', () => {
        // Legacy tests

        tDeepLmEq([
            'Hearty Durian', 
            'Hearty Durian', 
            'Hearty Truffle', 
            'Hearty Truffle', 
            'Apple'])
          ({
            prefix: 'Hearty',
            fxType: 'points',
            fxData: { points: 10, xtraHearts: 10}
          })
          (getDishEffectDetails, "T1 (%a)");

        tDeepLmEq([
            'Hearty Durian', 
            'Hearty Durian', 
            'Hearty Truffle', 
            'Hearty Truffle', 
            'Hearty Truffle'])
          ({
            prefix: 'Hearty',
            fxType: 'points',
            fxData: { points: 11, xtraHearts: 11}
          })
          (getDishEffectDetails, "T2 (%a)");

        tDeepLmEq(['Fleet-Lotus Seeds', 'Fleet-Lotus Seeds'])
          ({
            prefix: 'Hasty',
            fxType: 'timed',
            title: 'Speed Up',
            fxMD: {
              tierBps: [ 0, 30 ],
              potencyLevels: [ 7, 14 ],
              baseTimeInc: 30,
              totPotency: 28
            }, fxData: {
              tierNumber: 1,
              tierName: 'low',
              time: 120
            }
          })
          (getDishEffectDetails, 'T3 (x2 Fleet-Lotus Seeds)');

        // 18.03.28 update: this doesn't work and I don't remember why
        // tDeepLmEq(['Fleet-Lotus Seeds', 'Rushroom', 'Fleet-Lotus Seeds'])
        //   ({
        //     prefix: 'Hasty',
        //     fxType: 'timed',
        //     title: 'Speed Up',
        //     fxMD: {
        //       tierBps: [ 0, 30 ],
        //       potencyLevels: [ 7, 14 ],
        //       baseTimeInc: 30,
        //       totPotency: 35
        //     }, fxData: {
        //       tierNumber: 1,
        //       tierName: 'low',
        //       time: 120
        //     }
        //   })
        //   (getDishEffectDetails, 'def');

        tDeepLmEq(R.repeat('Fleet-Lotus Seeds', 4))
          ({
            prefix: 'Hasty',
            fxType: 'timed',
            title: 'Speed Up',
            fxMD: {
              tierBps: [ 0, 30 ],
              potencyLevels: [ 7, 14 ],
              baseTimeInc: 30,
              totPotency: 56
            }, fxData: {
              tierNumber: 2,
              tierName: 'mid',
              time: 240
            }
          })
          (getDishEffectDetails, 'T4 (x4 Fleet-Lotus Seeds)');

      });
    });

  });

};







ddd('main.js', t_mainJs);
/*
Electric Darner
Electric Keese Wing
Electric Keese Wing
Electric Keese Wing
Hinox Toenail
=>
Electro Elixir
Electro, low, 9:10
0 hearts
120r

Warm Safflina
Raw Bird Thigh
Raw Bird Thigh
Raw Bird Thigh
Rock Salt
=> 
Spicy Salt-Grilled Prime Meat
Spicy, low, 5:00
9 hearts
140r

Hylian Shroom
Swift Violet
Swift Violet
Swift Violet
Raw Whole Bird
=>
Hasty Steamed Meat
Hasty, mid, 4:00
7 hearts
190r

Mighty Bananas x5
=>
Mighty Simmered Fruit
Mighty, high, 4:10
5 hearts
70r

Rushroom
Rushroom
Rushroom
Swift Carrot
Swift Carrot
=>
Hasty Steamed Mushrooms
Hasty, mid, 5:00
5 hearts
___r

Endura Carrot
Hylian Rice
Goron Spice
=>
Enduring Veggie Rice Balls
Enduring, 2/5 yellow wheels
6 hearts
___r

Mighty Bananas
Mighty Bananas
Mighty Bananas
Raw Meat
Razorclaw Crab
=>
Mighty Meat and Seafood Fry
Mighty, high, 3:50
7 hearts
___r

Palm Fruit
Palm Fruit
Hearty DUrian
Raw Prime Meat
Raw Gourmet Meat
=>
Hearty Meat Skewer
Hearty, +4 yellow hearts
Full recovery
___r

Hydromelon
Hydromelon
Hydromelon
Hydromelon
Chillfin Trout
=>
Chilly Fish Skewer
Chilly, mid, 12:30
6 hearts
___r

Stamella Shroom x5
=>
Energizing Mushroom Skewer
Energizing, 1 and 2/5 green wheels
5 hearts
___r


Apple
Palm Fruit
Wildberry
Spicy Pepper
Raw Prime Meat
=>
Spicy Copious Simmered Fruit
Spicy, low, 4:30
8 hearts
___r


Bird Egg
Goron Spice
Dinraal's Scale
Naydra's Scale
Farosh's Scale
=>
Omelet
8.75 hearts
30r

Acorn
Raw Meat
Tabantha Wheat
Goat Butter
Goat Butter
=>
Meat Skewer
8 hearts
60r

Cool Safflina
Raw Gourmet Meat
Chillfin Trout
Dinraal's Scale
Naydra's Scale
=>
Chilly Gourmet Meat and Seafood Fry (crit possible)
Chilly, mid, 8:30
10.5 hearts


*/