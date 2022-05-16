const genNpmignore = () =>
`src/
node_modules/
package-lock.json
tsconfig.json
.vscode/
.travis.yml
.idea`
const genGitignore = () =>
`node_modules/
dist/
.DS_Store
.idea
.vscode/`
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
}`
const genReadme = (name) =>
`# ${name}

This is a module of EOAPI-Core.
`



const genRollupConfig = () => 
`
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import nodePolyfills from 'rollup-plugin-node-polyfills';

const sourcemap = 'inline';
const input = './src/index.ts';

const commonOptions = {
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          target: 'ES2017',
          module: 'ES2015'
        }
      }
    }),
    terser(),
    resolve(),
    commonjs(),
    nodePolyfills(),
    json(),
    replace({
      preventAssignment: true
    })
  ],
  input
};

/** @type import('rollup').RollupOptions */
const nodeCjs = {
  output: [{
    file: 'dist/index.js',
    format: 'cjs',
    sourcemap
  }],
  ...commonOptions
};

const bundles = [nodeCjs];

export default bundles;
`

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
`


module.exports = {
    genNpmignore,
    genGitignore,
    genTsconfig,
    genReadme,
    genRollupConfig,
    genNpmpublish
}