const prettier = require('prettier/standalone')
const parserHtml = require('prettier/parser-html')
const parserTypescript = require('prettier/parser-typescript')
const parserYaml = require('prettier/parser-yaml')
const parserBabel = require('prettier/parser-babel');

const prettierConfig =  {
    printWidth: 100,
    semi: true,
    vueIndentScriptAndStyle: true,
    singleQuote: true,
    trailingComma: 'all',
    proseWrap: 'never',
    htmlWhitespaceSensitivity: 'strict',
    endOfLine: 'auto',
    parser: 'babel',
    plugins: [parserBabel]
}

const prettierJS = (code) => {
    try {
        return prettier.format(code,prettierConfig);
    } catch (error) {
        return code;
    }
}

const prettierHTML = (code) => {
    try {
        return prettier.format(code, {
            parser: "html",
            plugins: [parserHtml],
        });
    } catch (error) {
        return code;
    }
}

const prettierJSON = (code) => {
    try {
        return prettier.format(code, {
            ...prettierConfig,
            parser: "json",
        });
    } catch (error) {
        return code;
    }
}
const  prettierTypescript = (code) => {
    try {
        return prettier.format(code, {
            parser: "typescript",
            plugins: [parserTypescript]
        });
    } catch (error) {
        return code;
    }
}
const  prettierYaml = (code) => {
    try {
        return prettier.format(code, {
            parser: "yaml",
            plugins: [parserYaml]
        });
    } catch (error) {
        return code;
    }
}

module.exports = {
    prettierJS,
    prettierHTML,
    prettierJSON,
    prettierTypescript,
    prettierYaml
}
