const generator = require("../../utils/generator");
const exportTmpl = require("../features/export");
const pushTmpl = require("../features/push");
const importTmpl = require("../features/import");

const feature = {
  push: {
    ...generator,
    ...pushTmpl
  },
  export: {
    ...generator,
    ...exportTmpl
  },
  import: {
    ...generator,
    ...importTmpl
  }
};

module.exports = feature;
