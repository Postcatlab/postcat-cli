const genPackageJSON = (name) =>
  JSON.stringify({
    name,
    version: "1.0.0",
    description: "eoapi extension for push api data to eolinker",
    main: "dist/index.js",
    moduleID: name,
    moduleName: "Push to Eolink",
    moduleType: "feature",
    logo: `https://s3.bmp.ovh/imgs/2022/05/18/d8d200e3dc050831.png`,
    main_node: "",
    main_debug: "",
    scripts: {
      test: "nodemon index.js",
      build: "rollup -c rollup.config.js",
      "build:watch": "rollup -w -c rollup.config.js",
    },
    type: "module",
    repository: {
      type: "git",
      url: `git+https://github.com/eolinker/${name}.git`,
    },
    keywords: [],
    author: "Eolink",
    license: "ISC",
    bugs: {
      url: `https://github.com/eolinker/${name}/issues`,
    },
    homepage: `https://github.com/eolinker/${name}#readme`,
    dependencies: {
      ky: "^0.30.0",
      "@rollup/plugin-commonjs": "^22.0.0",
      "@rollup/plugin-json": "^4.1.0",
      "@rollup/plugin-node-resolve": "^13.2.1",
      "@rollup/plugin-replace": "^4.0.0",
      rollup: "^2.70.2",
      "rollup-plugin-node-polyfills": "^0.2.1",
      "rollup-plugin-terser": "^7.0.2",
    },
    devDependencies: {
      nodemon: "^2.0.15",
    },
    features: {
      "apimanager.sync": {
        action: "sync_to_remote",
        label: "EoLink",
        description: "Push API data to eolink.",
        icon: `https://raw.githubusercontent.com/eolinker/${name}/main/assets/logo.png`,
        extestion: "",
      },
    },
  });

module.exports = {
  genPackageJSON,
};
