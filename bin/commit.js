#!/usr/bin/env node

const chalk = require('chalk');

/* 
  交互式询问用户输入
  https://github.com/enquirer/enquirer
*/
const { prompt } = require('enquirer');

/* 参数 */
const arg = process.argv.slice(2);
const args = require('minimist')(arg);

/* 控制台输出 */
const step = msg => console.log(chalk.cyan(msg))
/* 
  run 真实在终端跑命令，比如 yarn build --release
  使用 child_process 依赖也可以
  这里参看Vue3 使用的 execa
*/
const execa = require('execa');
/* 封装execa */
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts });

const command = (com) => {
  return execa.command(com);
}

async function main () {
    /* 判断是否有修改 */
    const { stdout: stdoutDiff } = await command('git diff');
    if (!stdoutDiff) {
        console.log(chalk.red('没有修改，结束commit'));
        return;
    }
    step('\ngit add -A');
    await command('git add -A');
    /* 输入commit message */
    const responseCommit = await prompt({
        type: 'input',
        name: 'commit',
        message: '请输入commit提交信息？'
    });
    const message = responseCommit.commit;
    if (message) {
        /* 从分支上获取规范化信息 */
        /* 1. 当前分支名称 */
        const {stdout: stdoutName} = await command(`git rev-parse --abbrev-ref HEAD`);
        /* 2. 正则获取需求号 */
        const matchArr = stdoutName.match(/^feature\/([A-Z]+-\d+)_/);
        const targetDemand = matchArr ? matchArr[1] : 'APP-000000';
        
        step(`\ngit commit -m '${targetDemand}: ${message}'`);
        await run('git', ['commit', '-m', `${targetDemand}:  ${message}`]);
        /* 
            确认是否push
        */
        const { isPush } = await prompt({
            type: 'select',
            name: 'isPush',
            message: '请确定是否push 远程?',
            choices: ['Y', 'N']
        });
        if (isPush === 'Y') {
            step(`\ngit push origin`);
            await command(`git push origin`);
            console.log(chalk.yellow(`push success！`));
        }
    } else {
        console.log(chalk.red(`请输入信息`));
        return;
    }
}

main();