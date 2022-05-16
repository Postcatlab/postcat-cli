#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const http = require("got");
const inquirer = require("inquirer");
const { Command } = require("commander");
const templates = require("./templates/");
const { generateProject } = require("./utils/generator");

const logger = {
  // [LogTypeEnum.success]: 'green',
  //   [LogTypeEnum.info]: 'blue',
  //   [LogTypeEnum.warn]: 'yellow',
  //   [LogTypeEnum.error]: 'red'
  // const header = chalk[this.levels[type]](`[Eo ${type.toUpperCase()}]:`)
  // console.log(header, ...messages)
  info: (msg) => console.log(msg),
};

const HOST = "http://106.12.149.147:3333";

const program = new Command();

program
  .command("generate")
  .alias("g")
  .argument("<name>", "module name")
  .option("-t, --type <type>", "plugin type")
  .description("create a module template.")
  .action((name, options) => {
    if (!/^eoapi-/.test(name)) {
      name = "eoapi-" + name;
    }
    const _generateProject = (tmpl) => {
      const basePath = path.join(process.cwd(), name);
      const files = ["./index.js", "package.json"];
      generateProject({ tmpl, basePath, files }, name);
      logger.info(`Template files of module ${name} is generated.`);
    };
    // 用户手动输入的插件类型
    const optionsType = options.type?.toLowerCase();
    /**  用户选择的插件类型 */
    const pluginTypes = Object.keys(templates);
    const pluginType = pluginTypes.find((n) => optionsType?.startsWith(n));
    /** 插件类型对应的模板类型  */
    const featurePluginTmpls = Object.keys(templates[pluginType] || {});
    const tmplType = featurePluginTmpls?.find((n) => optionsType?.endsWith(n));
    // 如果用户手动输入了完整的参数，则跳过命令行交互，直接根据用户传的参数进行创建
    if (options.type && tmplType && pluginType) {
      const tmpl = templates[pluginType][tmplType];
      _generateProject(tmpl);
    } else {
      inquirer
        .prompt([
          {
            type: "list",
            name: "moduleType",
            message: "Please select the type of plugin you want to create?",
            choices: ["Feature", "UI", "System"],
            filter: function (val) {
              return val.toLowerCase();
            },
          },
          {
            type: "list",
            name: "type",
            message: "Please select the template of plugin you want to create?",
            choices: ["Push", "Export-Openapi"],
            filter: function (val) {
              return val.toLowerCase();
            },
          },
        ])
        .then((answers) => {
          const { type, moduleType } = answers;
          const tmpl = templates[moduleType][type];
          _generateProject(tmpl);
        });
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
        json: json,
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
        json: { name },
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
        json: { name },
      })
      .json();
    if (code === 0) {
      console.log("🥂", msg);
    }
  });

program.parse();
