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
    scripts: {
      build: "rollup -c rollup.config.js",
      "build:watch": "rollup -w -c rollup.config.js",
    },
    type: "module",
    dependencies: {
      rollup: "^2.70.2",
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
