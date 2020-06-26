const data = require('./bundle')
const fs = require('fs')
const path = require('path')

// Bundle

const json = JSON.stringify(data)
const writePath = path.resolve(__dirname, './out/all.json')

fs.writeFile(writePath, json, 'utf8', (err) => {
  if (err) console.error(err)
  else console.log('completed with no errors')
})
