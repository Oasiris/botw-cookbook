/*
ALL SOURCES
(immediately below link is used for data18-01-05)
http://orcz.com/Breath_of_the_Wild:_Recipes
https://www.reddit.com/r/Breath_of_the_Wild/comments/5xf6ps/breath_of_the_wild_recipes_list_finally_added_to/
https://a.pomf.cat/shfoas.png
http://www.ign.com/wikis/the-legend-of-zelda-breath-of-the-wild/All_Recipes_and_Cookbook
https://zelda.gamepedia.com/Food

*/
// =============================================================================
// - Dependencies --------------------------------------------------------------
// =============================================================================

const util = require('util');
const fs = require('fs');
// const request = require('request');
const cheerio = require('cheerio');

// =============================================================================
// - Global Constants ----------------------------------------------------------
// =============================================================================

// If set to false, this script will make an HTTP request for the Wiki page's 
// HTML rather than use the ./data.html.
// Unless there's reason to, leave this at true.
const USE_SAVED_HTML = true;
const HTML_FILE_NAME = 'data18-01-05.html';  // Recipes/Material names
const ZELDA_FOOD_HTML = 'zeldaGamepediaFood.html'; // from Jan 10, 2018
const ZELDA_MAT_HTML = 'zeldaGamepediaMat.html';   // from Jan 10, 2018

// =============================================================================
// - Functions -----------------------------------------------------------------
// =============================================================================

/**
 * Takes, as a string, the name of a text file (or local path to a text file.) 
 * Returns a Promise that resolves to that file's content as a string.
 */
let readHtmlFile = fileName => util.promisify(fs.readFile)(fileName, 'utf8');


function parseZeldaMat(body) {
  let $ = cheerio.load(body);

  // console.log($tb.children().eq(0));
  let matList = [];

  $('table.altrow').eq(1).children('tbody').children('tr').each((idx, el) => {
    let row = $(el).children('td');
    let name = $(row).eq(0).text().trim();
    let desc = $(row).eq(1).text().trim().replace(/  /g, ' ');
    matList.push([name, desc]);
    // console.log(name, desc);
    // console.log('table');
  });
  console.log(JSON.stringify(matList));
}

readHtmlFile(ZELDA_MAT_HTML).then(d => parseZeldaMat(d)).catch(e => console.error(e));

// ===========================================================================


// Aim: Get each item description
function parseZeldaFood(body) {
  let $ = cheerio.load(body);
  let desc = {
    0: {categ: 'roasted', data: []},
    1: {categ: 'frozen', data: []},
    2: {categ: 'cooked', data: []},
  };

  $('table.collapsible').each((idx, el) => {
    if (!desc[idx]) {
      return;
    }
    let dataset = [];
    $(el).children('tbody').children('tr').each((i, e) => {
      let row = $(e).children('td');
      let name = $(row).eq(0).text().trim();
      let desc = $(row).eq(1).text().trim().replace(/  /g, ' ');
      if (name != '' && desc != '') {
        dataset.push([name, desc]);
      }

    });
    desc[idx].data = dataset;
  });
  console.log(JSON.stringify(desc));
}

// readHtmlFile(ZELDA_FOOD_HTML).then((d) => parseZeldaFood(d));

// ===========================================================================

// // Example code
// readHtmlFile(HTML_FILE_NAME)
//   .then((data) => {
//     // console.log(data);
//     parseHtml(data);
//   })
//   .catch((err) => {
//     console.error(err);
//   });


// /** 
//  * Note: This function currently has been tested with:
//  *   - data18-01-05.html
//  *
//  */


// function parseHtml(body) {
//   // Titles for the tables on the page, in order of appearance top to bottom.
//   const titles = ['Effects', 'Food', 'Critters', 'Monster Parts', 'Fillers', 
//     'Dishes (Hearts)', 'Dishes (Stamina)', 'Dishes (Cold Resist)', 
//     'Dishes (Heat Resist)', 'Dishes (Electric Resist)', 'Dishes (Movement Speed)', 
//     'Dishes (Temp Max Hearts)', 'Dishes (Defense Boost)', 'Dishes (Attack Power)', 
//     'Dishes (Stealth)', 'Elixirs'];

//   let tOfTables = [];

//   const $ = cheerio.load(body);
//   $('.wikitable').each((i, e) => {
//     let table = [];
//     // if (i == 0) {
//       console.log($(e).html());
//       $(e).children('tbody').children('tr').each((rowI, rowE) => {
//         let tableRow = [];
//         $(rowE).children().each((cellI, cellE) => {
//           tableRow.push($(cellE).html().trim().replace(/<br>/g, '\n'));
//         });
//         table.push(tableRow);
//       });
//       // console.log(table);
//       tOfTables.push(table);
//     // }

//   }); // end outermost each loop

//   console.log(tOfTables);
//   // console.log($);
// }


// // fs.readFile(HTML_FILE_NAME, 'utf8', (err, data) => {console.log(data)});

// // function requestHtmlFile() {
// // }