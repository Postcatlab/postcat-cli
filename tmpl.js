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
  "author": "Eolink",
  "version": "1.0.0",
  "description": "A ${name} module of EoApi.",
  "moduleID": "${name}",
  "moduleName": "${name}",
  "type": "feature",
  "main": "dist/index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\"",
    "build": "tsc"
  },
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
`
};

module.exports = template;
