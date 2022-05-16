const genPackageJSON = (name) =>
  JSON.stringify({
    name,
    version: "1.0.0",
    description: "eoapi extension for push api data to eolinker",
    main: "index.js",
    moduleID: name,
    moduleName: "Push to Eolink",
    moduleType: "feature",
    logo: `https://raw.githubusercontent.com/eolinker/${name}/main/assets/logo.png`,
    main_node: "",
    main_debug: "",
    scripts: {
      test: "nodemon index.js",
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