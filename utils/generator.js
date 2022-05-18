const path = require("path");
const fs = require("fs");
const { ensureDir } = require("./file");
const {
  prettierJS,
  prettierJSON,
  prettierTypescript,
  prettierYaml,
} = require("./codeFormatter");

const genNpmignore = () =>
  `src/
node_modules/
package-lock.json
tsconfig.json
.vscode/
.travis.yml
.idea`;
const genGitignore = () =>
  `node_modules/
dist/
.DS_Store
.idea
.vscode/`;
const genTsconfig = () =>
  `{
"compilerOptions": {
"target": "es5",
"module": "commonjs",
"declaration": true,
"rootDir": "src",
"outDir": "dist",
"esModuleInterop": true,
"forceConsistentCasingInFileNames": true,
"strict": true,
"skipLibCheck": true
},
"exclude": ["node_modules", "dist"]
}`;
const genReadme = (name) =>
  `# ${name}

This is a module of EOAPI-Core.
`;

const genRollupConfig = () =>
  `
  import { terser } from "rollup-plugin-terser";
  import commonjs from "@rollup/plugin-commonjs";
  import json from "@rollup/plugin-json";
  import replace from "@rollup/plugin-replace";
  import resolve from "@rollup/plugin-node-resolve";
  import nodePolyfills from "rollup-plugin-node-polyfills";
  
  const sourcemap = "inline";
  const input = "./index.js";
  
  const commonOptions = {
    plugins: [
      terser(),
      resolve(),
      commonjs(),
      nodePolyfills(),
      json(),
      replace({
        preventAssignment: true,
      }),
    ],
    input,
  };
  
  /** @type import('rollup').RollupOptions */
  const nodeCjs = {
    output: [
      {
        file: "dist/index.js",
        format: "umd",
        name: "index",
        sourcemap,
      },
    ],
    ...commonOptions,
  };
  
  const bundles = [nodeCjs];
  
  export default bundles;
  
`;

const genNpmpublish = () =>
  `# This workflow will run tests using node and then publish a package to GitHub Packages when a release is created
# For more information see: https://help.github.com/actions/language-and-framework-guides/publishing-nodejs-packages

name: Node.js Package

on:
release:
types: [created]

jobs:
build:
runs-on: ubuntu-latest
steps:
  - uses: actions/checkout@v2
  - uses: actions/setup-node@v2
    with:
      node-version: 16
  - run: npm ci
  - run: npm test

publish-npm:
needs: build
runs-on: ubuntu-latest
steps:
  - uses: actions/checkout@v2
  - uses: actions/setup-node@v2
    with:
      node-version: 16
      registry-url: https://registry.npmjs.org/
  - run: npm ci
  - run: npm run build
  - run: npm publish
    env:
      NODE_AUTH_TOKEN: \${{secrets.npm_token}}
`;
const genFileMap = (tmpl, basePath) => {
  const { join } = path;
  const src = join(basePath, "src");
  const githubWorkflows = join(basePath, ".github", "workflows");
  ensureDir(basePath);
  const getBasePath = (...rest) => join(basePath, ...rest);
  const getSrcPath = (...rest) => join(src, ...rest);
  const getGithubPath = (...rest) => join(githubWorkflows, ...rest);

  const fileMap = {};

  fileMap[getBasePath("/.gitignore")] = tmpl.genGitignore;

  fileMap[getBasePath("/.npmignore")] = tmpl.genNpmignore;

  fileMap[getBasePath("README.md")] = (name) => tmpl.genReadme(name);

  fileMap[getBasePath("rollup.config.js")] = () =>
    prettierJS(tmpl.genRollupConfig());

  fileMap[getBasePath("tsconfig.json")] = () =>
    prettierJSON(tmpl.genTsconfig());

  fileMap[getBasePath("package.json")] = (name) =>
    prettierJSON(tmpl.genPackageJSON(name));

  fileMap[getBasePath("index.js")] = (name) => prettierJS(tmpl.genMain(name));

  fileMap[getSrcPath("index.js")] = (name) => prettierJS(tmpl.genMain(name));

  fileMap[getSrcPath("index.ts")] = (name) =>
    prettierTypescript(tmpl.genMain(name));

  fileMap[getGithubPath("npm-publish.yml")] = () =>
    prettierYaml(tmpl.genNpmpublish());

  return new Proxy(fileMap, {
    get(target, key) {
      ensureDir(path.dirname(key));
      return target[key];
    },
  });
};

const generateProject = ({ tmpl, basePath, files = [] }, ...args) => {
  ensureDir(basePath);
  const fileMap = genFileMap(tmpl, basePath);
  files.forEach((name) => {
    const fullPath = path.join(basePath, name);
    fs.writeFileSync(fullPath, fileMap[fullPath](...args));
  });
};

module.exports = {
  genNpmignore,
  genGitignore,
  genTsconfig,
  genReadme,
  genRollupConfig,
  genNpmpublish,
  genFileMap,
  generateProject,
};
