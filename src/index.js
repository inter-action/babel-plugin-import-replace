import * as path from 'path'
import * as fs from 'fs'

export default function ({ types: t }) {
  return {
    pre(state) {
      // 这里拿不到compiler plugin的数据
    },
    visitor: {
      ImportDeclaration(path, state) {
        let filename = state.file.opts.filename
        let compilerOptions = state.opts
        if (!this.config) {
          this._config = new Config(compilerOptions.configFile)
        }

        let sourceNode = path.node.source
        let value = sourceNode.value

        if (!isRelativeImportPath(value) && this._config.contains(value)) {
          path.node.source = t.stringLiteral(this._config.replacedPath(filename, value))
        }
      },
      CallExpression(path, state){
        let filename = state.file.opts.filename
        let compilerOptions = state.opts

        let node = path.node
        if (!this.config) {
          this._config = new Config(compilerOptions.configFile)
        }

        if (t.isIdentifier(node.callee) && node.callee.name === 'require'){
          if (node.arguments.length === 1 && !isRelativeImportPath(node.arguments[0].value) && this._config.contains(node.arguments[0].value)){
            path.node.arguments[0] = t.stringLiteral(this._config.replacedPath(filename, path.node.arguments[0].value))
          }
        }
      }
    }
  };
}

function isRelativeImportPath(value) {
  return value.startsWith('./') || value.startsWith('../')
}

function loadRules(filename) {
  if (!filename) throwError('filename is required for this plugin to work')
  let relpath = path.resolve(process.cwd(), filename)
  let str = fs.readFileSync(relpath).toString()
  let config = JSON.parse(str)
  return config
}

class Config {
  constructor(filename) {
    this.config = loadRules(filename)
  }

  contains(path) {
    return !!this.config.includes.find(e => path === e)
  }

  replacedPath(filename, importFrom) {
    if (this.config.targetDir && filename) {
      let relativePath = path.relative(path.dirname(filename), this.config.targetDir)
      return `${relativePath}/${importFrom}`
    } else {
      return importFrom
    }
  }
}

let pluginName = 'babel-import-replace-plugin'
function throwError(msg) {
  throw new Error(`${pluginName}: ${msg}`)
}