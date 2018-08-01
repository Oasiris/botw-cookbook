const data = require('./bundler')
const fs = require('fs')

// Bundle

const json = JSON.stringify(data)

console.log(__dirname)

fs.writeFile(__dirname + '/all.json', json, 'utf8', (err) => {
  if (err) console.error(err);
  else     console.log('completed with no errors');
});