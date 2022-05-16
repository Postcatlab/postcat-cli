const generator = require("../../utils/generator");
const exportOpenapiTmpl = require("../features/export-openapi");
const pushTmpl = require("../features/push");

const feature = {
  push: {
    ...generator,
    ...pushTmpl
  },
  export: {
    ...generator,
    ...exportOpenapiTmpl
  }
};

module.exports = feature;
