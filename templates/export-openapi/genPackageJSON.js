const genPackageJSON = (name) =>
`{
  "name": "${name}",
  "version": "1.0.6",
  "description": "eoapi extension export openapi",
  "main": "dist/index.js",
  "moduleID": "${name}",
  "moduleName": "export-openapi",
  "moduleType": "feature",
  "logo": "https://raw.githubusercontent.com/eolinker/${name}/main/assets/openapi.png",
  "scripts": {
    "build": "rollup -c rollup.config.js",
    "build:watch": "rollup -w -c rollup.config.js",
    "test": "nodemon dist/index.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/eolinker/${name}.git"
  },
  "keywords": [],
  "author": "Eolink",
  "license": "Apache-2.0 License",
  "bugs": {
    "url": "https://github.com/eolinker/${name}/issues"
  },
  "homepage": "https://github.com/eolinker/${name}#readme",
  "devDependencies": {
    "@rollup/plugin-commonjs": "^22.0.0",
    "@rollup/plugin-json": "^4.1.0",
    "@rollup/plugin-node-resolve": "^13.2.1",
    "@rollup/plugin-replace": "^4.0.0",
    "@types/lodash": "^4.14.182",
    "@types/node": "^17.0.29",
    "lodash": "^4.17.21",
    "nodemon": "^2.0.15",
    "rollup": "^2.70.2",
    "rollup-plugin-node-polyfills": "^0.2.1",
    "rollup-plugin-terser": "^7.0.2",
    "rollup-plugin-typescript2": "^0.31.2",
    "typescript": "^4.6.3"
  },
  "features": {
    "apimanager.export": {
      "action": "export_convert_mock",
      "label": "OpenAPI(.json)",
      "description": "Convert api data into json of openapi format",
      "icon": "https://raw.githubusercontent.com/eolinker/${name}/main/assets/openapi.png",
      "filename": "openapi.json"
    }
  }
}
` 

module.exports ={
    genPackageJSON
}