const generator = require("../../utils/generator");
const exportOpenapiTmpl = require("../features/export");
const pushTmpl = require("../features/push");

const feature = {
  push: {
    ...generator,
    ...pushTmpl,
  },
  export: {
    ...generator,
    ...exportOpenapiTmpl,
  },
};

module.exports = feature;
