const template = {
  genIndex: (name) =>
    `module.exports = () => {
  return {
    id: '${name}',
    name: '${name}',
    core: '1.x',
    version: '1.0.0',
    description: '${name} module of EOAPI-Core',
    package: 'Community',
    cli__core(eo: any) {
      eo.logger.info(\`run cli__core [\${this.name} \${this.version}]\`);
      eo.command
        .command('test')
        .alias('t')
        .argument('<hook>', 'hook name')
        .description('display hooks description.')
        .action((hook: string) => {
          eo.logger.info(\`help of hook name \${hook}\`);
        });
      return eo;
    },
    app__db_load(eo: any) {
      console.log('app__db_load');
      eo.output.push('test');
      return eo;
    }
  }
}`,
  genPackageJSON: (name) =>
    `{
  "name": "${name}",
  "version": "1.0.0",
  "description": "A ${name} module of EOAPI-Core.",
  "main": "dist/index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\"",
    "build": "tsc"
  },
  "author": "Eolink",
  "license": "Apache-2.0 License",
  "devDependencies": {
    "@types/node": "^17.0.10"
  }
}`,
  genNpmignore: () =>
    `src/
node_modules/
package-lock.json
tsconfig.json
.vscode/
.travis.yml
.idea`,
  genGitignore: () =>
    `node_modules/
dist/
.DS_Store
.idea
.vscode/`,
  genTsconfig: () =>
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
}`,
  genReadme: (name) =>
    `# ${name}

This is a module of EOAPI-Core.
`,
  genNpmpublish: () =>
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
`,
}

module.exports = template
