const generator = require('../utils/generator')
const exportTmpl = require('./export')
const pushTmpl = require('./push')
const importTmpl = require('./import')

const type = {
  push: {
    ...generator,
    ...pushTmpl,
  },
  export: {
    ...generator,
    ...exportTmpl,
  },
  import: {
    ...generator,
    ...importTmpl,
  },
}

module.exports = type
