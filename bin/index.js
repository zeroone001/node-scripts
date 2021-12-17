#!/usr/bin/env node
/* 终端多色彩输出 */
const chalk = require("chalk");

const child_process = require("child_process");

/* 
  交互式询问用户输入
  https://github.com/enquirer/enquirer
*/
const { prompt } = require("enquirer");
/* 命令行参数
  其中process.argv的第一和第二个元素是Node可执行文件和被执行JavaScript文件的完全限定的文件系统路径，
  无论你是否这样输入他们
  $ node example/parse.js -x 3 -y 4 -n5 -abc --beep=boop foo bar baz
{ _: [ "foo", "bar", "baz" ],
  x: 3,
  y: 4,
  n: 5,
  a: true,
  b: true,
  c: true,
  beep: "boop" }
*/
const arg = process.argv.slice(2);
const args = require("minimist")(arg);
/* 路径 */
const path = require("path");
// __dirname
/* 要删除分支的项目的路径 */
const projectPath = path.resolve(__dirname, "../");
console.log(chalk.blue(`--->: ${projectPath}`));
/* 获取要删除的分支名的部分字符串 */
let branchStr = args.branch;
let responseBranch;

/* 
  run 真实在终端跑命令，比如 yarn build --release
  使用 child_process 依赖也可以
  这里参看Vue3 使用的 execa
*/
const execa = require("execa");
/* 封装execa */
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: "inherit", ...opts });

const command = (com) => {
  return execa.command(com);
};
/* 主函数 */
async function searchAndDeleteBranchs(projectPath, branchStr) {
  if (!branchStr) {
    // console.log(chalk.red(`请使用正确的命令-----> my-scripts --branch=feature`));
    // return;
    responseBranch = await prompt({
      type: "input",
      name: "branch",
      message: "请输入要删除的分支中的字符串？",
    });
    branchStr = responseBranch.branch;
  }
  console.log(chalk.yellow("查询本地git分支："));
  /* 执行git branch 命令 */
  const { stdout } = await command("git branch");
  console.log(chalk.yellow(`${stdout}`));

  let originsBranchs = stdout.split(/[(\r\n)\r\n]+/);
  /* 读取复合条件的分支, 要删除的分支 */
  const delBranch = originsBranchs.filter((item) => {
    // return item.trim().startsWith(branchStr);
    return item.trim().includes(branchStr);
  });

  /* 判断有没有查到 */
  if (delBranch.length === 0) {
    console.log(
      chalk.yellow(`\n分支查询完成，无有字符串为 ${branchStr} 的分支!`)
    );
    return;
  }

  console.log(
    chalk.green(
      `\n分支查询完成，删除字符串为 ${branchStr} 的分支, 一共 ${delBranch.length} 个...\n`
    )
  );

  /* 
    确认是否删除
  */
  const { isDelete } = await prompt({
    type: "select",
    name: "isDelete",
    message: "请确定是否删除分支?",
    choices: ["Y", "N"],
  });
  /* 如果选择了否，就退出 */
  if (isDelete === "N") {
    return;
  }
  /* 2. 执行删除命令 这里不能用forEach 循环 */
  // delBranch.forEach((item) => {
  //   await command(`git branch -D ${item}`);
  // });
  /* parallel , 如果按照顺序执行删除的话，使用 for of */
  await Promise.all(
    delBranch.map(async (item) => {
      await command(`git branch -D ${item}`);
    })
  );
  console.log(chalk.green("\n删除完成!"));

  /* END 查询剩余分支 */
  console.log(chalk.green("\n剩余本地分支:"));
  const { stdout: lastStdout } = await command("git branch");
  console.log(chalk.green(`${lastStdout}`));
}

searchAndDeleteBranchs(projectPath, branchStr);
