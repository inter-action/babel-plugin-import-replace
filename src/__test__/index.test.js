import fs from 'fs'
import path from 'path'
import * as babel from 'babel-core'
// import plugin from '../../'
import plugin from '../'
import test from 'ava';


let compiler = newBabelCompiler({configFile: 'src/__test__/config.json'})
let srcImport = `
  import {autorun, observerable} from 'mobx'
`
test('replace import should work as expected', t => {
  let code = compiler(srcImport.trim())
  t.is(code, `import { autorun, observerable } from '../libs/mobx';`)
});

test('replace require should work as expected', t => {
  let src = `const c = require('mobx')`
  let code = compiler(src.trim())
  t.is(code, `const c = require('../libs/mobx');`)
});

function newBabelCompiler(pluginOptions, babelOptions = { filename: __filename }) {
  return function (input) {
    const { code } = babel.transform(input, {
      babelrc: false,
      plugins: [[plugin, pluginOptions]],
      ...babelOptions
    })
    return code
  }
}
