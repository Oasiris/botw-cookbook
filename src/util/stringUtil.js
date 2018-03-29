/**
 * @param {String} s String to be manipulated.
 * @return Input string as a proper noun, in the format of Abcde X. Yz.
 * 
 * Note that this only splits on regular spaces of length 1. Other whitespace 
 * characters, or consecutive whitespace characters, will not exhibit 
 * the intended behavior.
 */
let toProper = s => s
  .split(' ')
  .map(s => s.length > 0 ? s[0].toUpperCase() + s.slice(1) : s)
  .join(' ');

// Exports

module.exports = {
  toProper: toProper
};