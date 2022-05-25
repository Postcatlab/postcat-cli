const path = require("path");
const fs = require("fs");
const { ensureDir } = require("./file");
const {
  prettierJS,
  prettierJSON,
  prettierTypescript,
  prettierYaml
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
  /** @type import('rollup').RollupOptions */
  const nodeCjs = {
    input: "./index.js",
    output: [
      {
        file: "dist/index.js",
        format: "umd",
        name: "index",
        sourcemap: "inline",
      },
    ],
  };
  
  const bundles = [nodeCjs];
  
  export default bundles;
  
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

  return new Proxy(fileMap, {
    get(target, key) {
      ensureDir(path.dirname(key));
      return target[key];
    }
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
  genFileMap,
  generateProject
};
