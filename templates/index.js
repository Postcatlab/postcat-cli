const generator = require('../utils/generator')
const exportOpenapiTmpl = require('./export-openapi')
const pushTmpl = require('./push')


const typeMap = {
    'push': {
        ...generator,
        ...pushTmpl
    },
    'export-openapi': {
        ...generator,
        ...exportOpenapiTmpl
    },
}

module.exports = typeMap