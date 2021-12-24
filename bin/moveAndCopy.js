#!/usr/bin/env node

/* https://juejin.cn/post/7045186946200502285/ */
const fs = require('fs');
const path = require('path');

const resolvePath = (thePath) => {
  return path.resolve(__dirname, thePath);
};

function moveCopy(orgFilepath, desFilepath) {
  // fs.copyFileSync(orgfilepath, desfilepath);
  // const rs = fs.createReadStream(orgFilepath);
  const rs = fs.readFileSync(orgFilepath);
  console.log('rs', rs);
  // const ws = fs.createWriteStream(desFilepath);
  // fs.pipe(ws);
  fs.appendFileSync(desFilepath, rs);
}
moveCopy(resolvePath('../src/global.d.ts'), resolvePath('../lib/index.d.ts'));
