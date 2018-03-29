/**
 * Compiles everything in the util folder into a single exportable.
 */

/* Dependencies */
const glob = require('glob');
const globby = require('globby');

/* Constants */

// Executes Object.assign, but takes a maximum of 2 arguments.
const cappedAssign = (a, b) => Object.assign(a, b);

/* Functions */

/**
 * @return A list of functions in the module.exports for every JS file in 
 * this folder. 
 */
const getFunctions = () => {
  const searchPath = `${__dirname}\\*.js`;
  let scripts = glob.sync(searchPath);
  // Remove __dirname at start.
  scripts = scripts.map(s => s.slice(__dirname.length + 1));
  // Filter out the 'index.js'.
  scripts = scripts.filter(s => s !== 'index.js');
  // Get all of the functions.
  const funcs = scripts.map(s => require(`./${s}`));
  const flattenedFuncs = funcs.reduce(cappedAssign, {});
  return flattenedFuncs;
}

// Console output
// console.log(getFunctions());

/* Exports */
module.exports = getFunctions();
