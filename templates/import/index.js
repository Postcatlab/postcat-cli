const fs = require("fs");
const path = require("path");
const { genPackageJSON } = require("./genPackageJSON");

const mainCode = `
export const importFunc = (data = {}) => {
  return {
    name: "eoapi"
  };
};
`;
const template = {
  genMain: () => mainCode,
  genPackageJSON
};

module.exports = template;
