const rcp = require('./recipesRaw.json');

// Capitalizes first letter of every word in a string
let makeProperString = str => str.split(' ').map(s => s.toUpperCase().slice(0, 1) + s.slice(1)).join(' ');


function process(data) {
  let out = [];
  for (let r of data) {
    delete r.FIELD1;
    delete r.EN;
    delete r.FIELD5;

    r.ingredients = [];
    for (let i = 6; i <= 10; i ++) {
      if (r['FIELD' + i] == '–') break;
      let ingredName = makeProperString(r['FIELD' + i]);
      r.ingredients.push(['name', ingredName]);
    }




    // r.ingredients = [
    //   ["name", r.FIELD6]
    // ];
    // (r.FIELD7  !== '–') ? r.ingredients.push(['name', r.FIELD7]) : null;
    // (r.FIELD8  !== '–') ? r.ingredients.push(['name', r.FIELD8]) : null;
    // (r.FIELD9  !== '–') ? r.ingredients.push(['name', r.FIELD9]) : null;
    // (r.FIELD10 !== '–') ? r.ingredients.push(['name', r.FIELD10]) : null;
    for (let i = 6; i <= 28; i++) {
      if (i != 18) {
        delete r['FIELD' + i];
      }
    }
    out.push(r);


  }









  return out;
}



console.log(JSON.stringify(process(rcp)));





