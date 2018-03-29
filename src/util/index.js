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

// /**
//  * @return A list of functions in the module.exports for every JS file in 
//  * this folder. 
//  */
// const getFunctions = async () => {
//   let scripts = await globby(['./*.js']);
//   // Filter out the 'index.js'.
//   scripts = scripts.filter(s => s !== 'index.js');
//   // Get all of the functions.
//   const funcs = scripts.map(s => require(`./${s}`));
//   const flattenedFuncs = funcs.reduce(cappedAssign, {});
//   return flattenedFuncs;
// }


/**
 * @return A list of functions in the module.exports for every JS file in 
 * this folder. 
 */
// const getFunctions = () => {
//   // Must include __dirname or the script that `require`s 
//   const path = `${__dirname}\\*.js`;
//   // console.log(path);
//   let count = 0;
//   glob(path, {}, (err, files) => {
//     console.log(count++);
//     if (err) console.err(err);
//     // Remove absolute path from each path string
//     files = files.map(s => s.slice(__dirname.length + 1));
//     // Filter out 'index.js'
//     files = files.filter(s => s !== 'index.js');
//     // Get all of the functions.
//     const funcs = files.map(s => require(`./${s}`));
//     const flattenedFuncs = funcs.reduce(cappedAssign, {});
//     console.log(flattenedFuncs);
//     return flattenedFuncs;
//     // console.log(files);
//   });
//   // console.log(scripts);
//   // // Filter out the 'index.js'.
//   // scripts = scripts.filter(s => s !== 'index.js');
//   // // Get all of the functions.
//   // const funcs = scripts.map(s => require(`./${s}`));
//   // const flattenedFuncs = funcs.reduce(cappedAssign, {});
//   // return flattenedFuncs;
// }

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
// getFunctions().then((v) => console.log(v));
// getFunctions().then(v => console.log(v));

/* Exports */ 
// getFunctions().then(v => module.exports = v);
// console.log(getFunctions());

module.exports = getFunctions();
// module.exports = getFunctions().then(v );
// module.exports = getFunctions().then((v) => v);
