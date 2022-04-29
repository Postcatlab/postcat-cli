#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const http = require("got");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { Command } = require("commander");
const templates = require("./templates/");

const pluginTypes = ['Push', 'Export-Openapi']

const ensureDir = (name) => {
  if (fs.existsSync(name)) {
    return true;
  } else {
    if (ensureDir(path.dirname(name))) {
      fs.mkdirSync(name);
      return true;
    }
  }
};
const logger = {
  // [LogTypeEnum.success]: 'green',
  //   [LogTypeEnum.info]: 'blue',
  //   [LogTypeEnum.warn]: 'yellow',
  //   [LogTypeEnum.error]: 'red'
  // const header = chalk[this.levels[type]](`[Eo ${type.toUpperCase()}]:`)
  // console.log(header, ...messages)
  info: (msg) => console.log(msg)
};

const HOST = "http://106.12.149.147:3333";

const program = new Command();

program
  .command("generate")
  .alias("g")
  .argument("<name>", "module name")
  .option('-t, --type <type>', 'plugin type')
  .description("create a module template.")
  .action((name, options) => {
    if (!/^eoapi-/.test(name)) {
      name = "eoapi-" + name;
    }
    const generateProject = (tmpl) => {
        const _path = path.join(process.cwd(), name);
        ensureDir(_path);
        fs.writeFileSync(`${_path}/package.json`, tmpl.genPackageJSON(name));
        fs.writeFileSync(`${_path}/tsconfig.json`, tmpl.genTsconfig());
        fs.writeFileSync(`${_path}/rollup.config.ts`, tmpl.genRollupConfig());
        fs.writeFileSync(`${_path}/.gitignore`, tmpl.genGitignore());
        fs.writeFileSync(`${_path}/.npmignore`, tmpl.genNpmignore());
        fs.writeFileSync(`${_path}/README.md`, tmpl.genReadme(name));
        const _src = path.join(_path, "src");
        ensureDir(_src);
        fs.writeFileSync(`${_src}/index.ts`, tmpl.genMain(name));
        const _github = path.join(_path, ".github", "workflows");
        ensureDir(_github);
        fs.writeFileSync(`${_github}/npm-publish.yml`, tmpl.genNpmpublish());
        logger.info(`Template files of module ${name} is generated.`);
    }
    if (pluginTypes.some(n => n.toLowerCase() === options.type)) {
        const tmpl = templates[options.type.toLowerCase()]
        generateProject(tmpl)
    } else {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'type',
                    message: 'Please select the type of plugin you want to create?',
                    choices: [
                        {
                            name: 'Push',
                            value: 'Push',
                        },
                        {
                            name: 'Export-Openapi',
                            value: 'Export-Openapi',
                        },
                    ],
                    filter: function (val) {
                        return val.toLowerCase();
                    },
                },
            ])
            .then(answers => {
                const tmpl = templates[answers.type]
                generateProject(tmpl)
            })
    }
  });

program
  .command("upload <pkgName>")
  .description("Upload the plugin message to plugin market.")
  .action(async (pkgName) => {
    const _path = path.join(process.cwd(), pkgName);
    const packageJson = fs.readFileSync(`${_path}/package.json`, "utf8");
    const json = JSON.parse(packageJson);
    const { code, msg } = await http
      .post(HOST + "/upload", {
        json: json
      })
      .json();

    if (code !== 0) {
      console.log("😂", msg);
      return;
    }
    console.log("🥂", msg);
  });

program
  .command("reliable <name>")
  .description("reliable the plugin.")
  .action(async (name) => {
    const { code, msg } = await http
      .post(HOST + "/reliable", {
        json: { name }
      })
      .json();
    if (code === 0) {
      console.log("🥂", msg);
    }
  });

program
  .command("unreliable <name>")
  .description("unreliable the plugin.")
  .action(async (name) => {
    const { code, msg } = await http
      .post(HOST + "/unreliable", {
        json: { name }
      })
      .json();
    if (code === 0) {
      console.log("🥂", msg);
    }
  });

program.parse();
