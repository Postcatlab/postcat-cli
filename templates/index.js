const generator = require('../utils/generator')
const exportOpenapi = require('./export-openapi')
const pushEolink = require('./push-eolink')


const typeMap = {
    'feature-push': {
        ...generator,
        ...pushEolink
    },
    'feature-export': {
        ...generator,
        ...exportOpenapi
    },
}

module.exports = typeMap