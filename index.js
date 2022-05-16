#!/usr/bin/env node

const fs = require("fs");
const fss = require("fs-extra");
const path = require("path");
const shell = require("shelljs");
const http = require("got");
const chalk = require("chalk");
const {
  prettierJS,
  prettierJSON,
  prettierTypescript,
  prettierYaml
} = require("./utils/codeFormatter");
const inquirer = require("inquirer");
const { Command } = require("commander");
const templates = require("./templates/");

/**  */
const pluginTypes = ["Feature", "UI", "System"];
const featurePluginTmpls = ["Push", "Export"];

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
  success: chalk.green,
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
  .option("-t, --type <type>", "plugin type")
  .description("create a module template.")
  .action((name, options) => {
    if (!/^eoapi-/.test(name)) {
      name = "eoapi-" + name;
    }
    /**  */
    const generateProject = (tmpl) => {
      const _path = path.join(process.cwd(), name);
      ensureDir(_path);
      fs.writeFileSync(
        `${_path}/package.json`,
        prettierJSON(tmpl.genPackageJSON(name))
      );
      fs.writeFileSync(
        `${_path}/tsconfig.json`,
        prettierJSON(tmpl.genTsconfig())
      );
      fs.writeFileSync(
        `${_path}/rollup.config.ts`,
        prettierTypescript(tmpl.genRollupConfig())
      );
      fs.writeFileSync(`${_path}/.gitignore`, tmpl.genGitignore());
      fs.writeFileSync(`${_path}/.npmignore`, tmpl.genNpmignore());
      fs.writeFileSync(`${_path}/README.md`, tmpl.genReadme(name));
      const _src = path.join(_path, "src");
      ensureDir(_src);
      fs.writeFileSync(
        `${_src}/index.ts`,
        prettierTypescript(tmpl.genMain(name))
      );
      const _github = path.join(_path, ".github", "workflows");
      ensureDir(_github);
      fs.writeFileSync(
        `${_github}/npm-publish.yml`,
        prettierYaml(tmpl.genNpmpublish())
      );
      logger.info(`Template files of module ${name} is generated.`);
    };

    /**  用户选择的插件类型 */
    const pluginType = pluginTypes.find((n) =>
      options.type?.startsWith(n.toLowerCase())
    );
    /** 插件类型对应的模板类型  */
    const tmplType = featurePluginTmpls.find((n) =>
      options.type?.endsWith(n.toLowerCase())
    );
    if (tmplType && pluginType) {
      const tmpl = templates[pluginType.toLowerCase()][tmplType.toLowerCase()];
      generateProject(tmpl);
    } else {
      inquirer
        .prompt([
          {
            type: "list",
            name: "moduleType",
            message: "Please select the type of plugin you want to create?",
            choices: [
              {
                name: "Feature",
                value: "Feature"
              },
              {
                name: "UI",
                value: "UI"
              },
              {
                name: "System",
                value: "System"
              }
            ],
            filter: function (val) {
              return val.toLowerCase();
            }
          },
          {
            type: "list",
            name: "type",
            message: "Please select the template of plugin you want to create?",
            choices: [
              {
                name: "Push",
                value: "Push"
              },
              {
                name: "Export",
                value: "Export"
              }
            ],
            filter: function (val) {
              return val.toLowerCase();
            }
          }
        ])
        .then((answers) => {
          const { type, moduleType } = answers;
          const tmpl = templates[moduleType][type];
          generateProject(tmpl);
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

program
  .command("debug <pkgPath>")
  .description("Install extension from location.")
  .action(async (pkgPath) => {
    // * 获取 home 目录路径
    const homePath = process.env.HOME || process.env.USERPROFILE;
    // * 获取插件包路径
    const filePath = path.join(process.cwd(), pkgPath);
    // * 获取插件名
    const { name, version } = await fss.readJson(`${filePath}/package.json`);
    const debuggerPath = path.join(homePath, ".eo/data/debugger.json");
    const eoModule = await fss.readJson(
      path.join(homePath, ".eo/package.json")
    );
    // * 添加并写入 package.json / dependencies 配置
    eoModule.dependencies[name] = version;
    fss.writeJsonSync(path.join(homePath, ".eo/package.json"), eoModule);
    fss
      .readJson(debuggerPath)
      .then((json) => {
        json.extensions.push(name);
        fss.writeJsonSync(debuggerPath, json);
      })
      .catch((e) => {
        fss.writeJsonSync(debuggerPath, { extensions: [name] });
      });
    // * 通过链接安装到本地
    shell.cd(`${homePath}/.eo`);
    shell.exec(`npm link ${filePath}`);
    logger.success("Done");
  });

program
  .command("undebug <pkgPath>")
  .description("Uninstall extension from location.")
  .action(async (pkgPath) => {
    // * 获取 home 目录路径
    const homePath = process.env.HOME || process.env.USERPROFILE;
    // * 获取插件包路径
    const filePath = path.join(process.cwd(), pkgPath);
    // * 获取插件名
    const { name } = await fss.readJson(`${filePath}/package.json`);
    const debuggerPath = path.join(homePath, ".eo/data/debugger.json");
    fss
      .readJson(debuggerPath)
      .then((json) => {
        json.extensions = json.extensions.filter((it) => it !== name);
        fss.writeJsonSync(debuggerPath, json);
      })
      .catch((e) => {
        fss.writeJsonSync(debuggerPath, { extensions: [] });
      });
    // * 通过链接安装到本地
    shell.cd(`${homePath}/.eo`);
    shell.exec(`npm unlink ${name}`);
    logger.success("Done");
  });

program.parse();
