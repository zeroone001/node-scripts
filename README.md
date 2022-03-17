# node-scripts

node 的一些工具小脚本，用于练习node



## 批量删除本地分支

```js
// lys 是分支中的字符串
// 第一步，先切换到要删除分支的项目中去； 第二部执行下面命令
my-scripts
// 第三步，输出要删除的分支中的字符串
/* 或者使用下面的命令直接删除 */
my-scripts --branch=lys
```

### inquirer

用来做提问

### enquirer

https://github.com/enquirer/enquirer
建议用这个，交互式，命令输入


## Node 命令行工具包

```
npm install --save-dev typescript @types/node rimraf


npm i -D eslint@7.32.0 @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier eslint-plugin-prettier prettier
```

npm install -D husky lint-staged


## 参考资料

* [怎样开发一个 Node.js 命令行工具包](https://mp.weixin.qq.com/s/QWHcXnTXpjCtVDRFgxd8Wg)

## CLI 常用三方库

commander —— 提供 cli 命令与参数
glob —— 遍历文件
shelljs —— 常用的 shell 命令支持
prompts —— 读取控制台用户输入
fs-extra —— 文件读写等操作
inquirer —— 类似于 prompts
chalk —— 彩色日志
debug —— 类似于 chalk
execa —— 执行 shell 指令
