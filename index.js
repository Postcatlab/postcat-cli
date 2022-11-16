#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const shell = require('shelljs')
const chalk = require('chalk')
const http = require('got')
const packageJson = require('./package.json')
const inquirer = require('inquirer')
const { Command } = require('commander')
const templates = require('./templates/')
const { generateProject } = require('./utils/generator')

const logger = {
  success: chalk.green,
  //   [LogTypeEnum.info]: 'blue',
  //   [LogTypeEnum.warn]: 'yellow',
  //   [LogTypeEnum.error]: 'red'
  // const header = chalk[this.levels[type]](`[Eo ${type.toUpperCase()}]:`)
  // console.log(header, ...messages)
  info: (msg) => console.log(msg),
}

// const HOST = "http://market.eoapi.io";
const HOST = 'http://106.12.149.147'
// const HOST = "http://localhost:80";

const program = new Command()
program.version(packageJson.version)

program
  .command('generate')
  .alias('g')
  .argument('<name>', 'module name')
  .option('-t, --type <type>', 'plugin type')
  .description('create a module template.')
  .action((name, options) => {
    if (!/^eoapi-/.test(name)) {
      name = 'eoapi-' + name
    }
    const _generateProject = (tmpl) => {
      const basePath = path.join(process.cwd(), name)
      const files = ['index.js', 'package.json', 'rollup.config.js']
      generateProject({ tmpl, basePath, files }, name)
      logger.info(`Template files of module ${name} is generated.`)
    }
    // 用户手动输入的插件类型
    const optionsType = options.type?.toLowerCase()
    /**  用户选择的插件类型 */
    const pluginTypes = Object.keys(templates)
    const pluginType = pluginTypes.find((n) => optionsType?.startsWith(n))
    /** 插件类型对应的模板类型  */
    const featurePluginTmpls = Object.keys(templates[pluginType] || {})
    const tmplType = featurePluginTmpls?.find((n) => optionsType?.endsWith(n))
    // 如果用户手动输入了完整的参数，则跳过命令行交互，直接根据用户传的参数进行创建
    if (options.type && tmplType && pluginType) {
      const tmpl = templates[pluginType][tmplType]
      _generateProject(tmpl)
    } else {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'type',
            message: 'Please select the template of plugin you want to create?',
            choices: ['Push', 'Export', 'Import'],
            filter: function (val) {
              return val.toLowerCase()
            },
          },
        ])
        .then((answers) => {
          const { type } = answers
          const tmpl = templates[type]
          _generateProject(tmpl)
        })
    }
  })

program
  .command('upload <pkgName>')
  .description('Upload the plugin message to plugin market.')
  .action(async (pkgName) => {
    const _path = path.join(process.cwd(), pkgName)
    const json = fs.readJsonSync(`${_path}/package.json`)
    if (json.features?.i18n) {
      let langs = [
        json.features.i18n.sourceLocale,
        ...json.features.i18n.locales,
      ]
      json.i18n = []
      langs.forEach((lang) => {
        if (!lang) return
        try {
          json.i18n.push({
            locale: lang,
            package: fs.readJsonSync(`${_path}/i18n/${lang}.json`),
          })
        } catch (e) {
          console.log('read i18n error:', e)
        }
      })
    }
    const { code, msg } = await http
      .post(HOST + '/upload', {
        json,
      })
      .json()

    if (code !== 0) {
      console.log('😂', msg)
      return
    }
    console.log('🥂', msg)
  })

program
  .command('debug <pkgPath>')
  .description('Install extension from location.')
  .action(async (pkgPath = '') => {
    // * 获取 home 目录路径
    const homePath = process.env.HOME || process.env.USERPROFILE
    // * 获取插件包路径
    const filePath = path.join(process.cwd(), pkgPath)
    // * 获取插件名
    const { name, version } = await fs.readJson(`${filePath}/package.json`)
    const debuggerPath = path.join(homePath, '.eo/data/debugger.json')
    const eoModule = await fs.readJson(path.join(homePath, '.eo/package.json'))
    // * 添加并写入 package.json / dependencies 配置
    eoModule.dependencies[name] = version
    fs.writeJsonSync(path.join(homePath, '.eo/package.json'), eoModule)
    fs.readJson(debuggerPath)
      .then((json) => {
        if (!json.extensions.includes(name)) {
          json.extensions.push(name)
          fs.writeJsonSync(debuggerPath, json)
        }
      })
      .catch((e) => {
        fs.writeJsonSync(debuggerPath, { extensions: [name] })
      })
    // * 通过链接安装到本地
    shell.cd(`${homePath}/.eo`)
    shell.exec(`npm install ${filePath}`)
    logger.success('Done')
  })

program
  .command('undebug <pkgPath>')
  .description('Uninstall extension from location.')
  .action(async (pkgPath) => {
    // * 获取 home 目录路径
    const homePath = process.env.HOME || process.env.USERPROFILE
    // * 获取插件包路径
    const filePath = path.join(process.cwd(), pkgPath)
    // * 获取插件名
    const { name } = await fs.readJson(`${filePath}/package.json`)
    const debuggerPath = path.join(homePath, '.eo/data/debugger.json')
    fs.readJson(debuggerPath)
      .then((json) => {
        json.extensions = json.extensions?.filter((it) => it !== name)
        fs.writeJsonSync(debuggerPath, json)
      })
      .catch((e) => {
        fs.writeJsonSync(debuggerPath, { extensions: [] })
      })
    // * 通过链接安装到本地
    shell.cd(`${homePath}/.eo`)
    shell.exec(`npm uninstall ${name}`)
    logger.success('Done')
  })

program.parse()
