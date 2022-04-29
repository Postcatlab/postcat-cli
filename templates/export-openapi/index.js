const fs = require('fs')
const path = require('path')
const {genPackageJSON} = require('./genPackageJSON')

const template = {
    genMain: (name) =>
    fs.readFileSync(path.resolve(__dirname,'./index.tmp.txt'), 'utf-8'),
    genPackageJSON,
  }
  
  module.exports = template
  