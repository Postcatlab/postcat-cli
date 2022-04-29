const fs = require("fs");
const path = require("path");
const { genPackageJSON } = require("./genPackageJSON");

const mainCode = `
export const exportFunc = (data = {}) => {
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
