
## Desc
this plugin replaces absolute module import based on customized config rules.

one example usage is combined with webpack to sovle the problem that you can't import npm modules in the weixin mini program development.


这个插件可以通过配置信息将node_modules引入的package根据规则替换成其他路径。
一个用例是结合webpack打包来解决微信小程序没法引入node_modules目录中的依赖问题。

```js
// before compile phase
import {observable} from 'mobx'

// after compile phase
let mobx = require('./libs/mobx')
let {observable} = mobx
```

## config

```js
// create a import-config.json file
{
  "includes": ["mobx"], // which modules to be included
  "targetDir": "src/libs" // this is the path that this plugin caculates the relative path result from all other files imported mobx
}
```


```js
// .babelrc
{
  "plugins":[
    ["import-replace", {"configFile": "import-config.json"}]
  ]
}

```




## others

webpack config example that packages node_module dependencies into a custom directory

* use case includes non standard environments, like wei-xin mini program


```js
const utils = require('./build-scripts/utils-es5') 

let deps = utils.getDependencies() // read dependencies info from package json as array<string>, ['mobx', 'loadash']
let libsPath = utils.getConfig().libsPath // return the target directory you want the packaged lib goes into, like 'build/lib'

module.exports = {
  entry: genernateEntry(deps),
  output: {
    path: libsPath,
    filename: "[name].js",
    libraryTarget: "commonjs2",
  }
};


function genernateEntry(entries){
  let r = {}
  entries.forEach(e=>r[e]=`./node_modules/${e}`) 
  return r
}
```

## links
* [babel playbook](https://github.com/thejameskyle/babel-handbook/blob/master/translations/en/plugin-handbook.md)
* [babel ast reference](https://github.com/babel/babylon/blob/master/ast/spec.md) 
* [publish npm module ](https://docs.npmjs.com/getting-started/publishing-npm-packages)
