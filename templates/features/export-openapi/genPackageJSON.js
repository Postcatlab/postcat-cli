const genPackageJSON = (name) =>
  `{
  "name": "${name}",
  "version": "1.0.0",
  "description": "The export extension of eoapi",
  "main": "dist/index.js",
  "moduleID": "${name}",
  "moduleName": "${name}",
  "moduleType": "feature",
  "logo": "",
  "scripts": {
    "build": "rollup -c rollup.config.js",
    "build:watch": "rollup -w -c rollup.config.js",
    "test": ""
  },
  "keywords": [],
  "author": "",
  "license": "Apache-2.0 License",
  "devDependencies": {
    "@rollup/plugin-commonjs": "^22.0.0",
    "@rollup/plugin-json": "^4.1.0",
    "@rollup/plugin-node-resolve": "^13.2.1",
    "@rollup/plugin-replace": "^4.0.0",
    "@types/lodash": "^4.14.182",
    "@types/node": "^17.0.29",
    "lodash": "^4.17.21",
    "rollup": "^2.70.2",
    "rollup-plugin-node-polyfills": "^0.2.1",
    "rollup-plugin-terser": "^7.0.2",
    "rollup-plugin-typescript2": "^0.31.2",
    "typescript": "^4.6.3"
  },
  "features": {
    "apimanager.export": {
      "action": "exportFunc",
      "label": "OpenAPI(.json)",
      "description": "Convert api data into json of openapi format",
      "icon": "",
      "filename": "openapi.json"
    }
  }
}

`;

module.exports = {
  genPackageJSON
};
