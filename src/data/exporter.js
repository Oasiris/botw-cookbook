const data = require('./data')
const fs = require('fs')

// Bundle

const json = JSON.stringify(data)

fs.writeFile('./all.json', json, 'utf8', callback);