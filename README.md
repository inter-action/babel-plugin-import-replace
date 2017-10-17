
## Desc
this plugin replaces absolute module import based on customized config rules.

one example usage is combined with webpack to sovle the problem that you can't import npm modules in the weixin mini program development.

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



## links
* [babel playbook](https://github.com/thejameskyle/babel-handbook/blob/master/translations/en/plugin-handbook.md)
* [babel ast reference](https://github.com/babel/babylon/blob/master/ast/spec.md) 
* [publish npm module ](https://docs.npmjs.com/getting-started/publishing-npm-packages)
