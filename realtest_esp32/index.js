const path = require('path');
const fs = require('fs');

const config = require('./config.js');

console.log(
  `obniz ${config.esp32_ID} ${config.obnizA_ID} ${config.obnizB_ID}を` + //eslint-disable-line non-ascii
    `つかうよ!\n3つを"同じ"電源に繋いでね。` //eslint-disable-line non-ascii
);

describe('obniz', async () => {
  const files = fs.readdirSync(path.join(__dirname, 'tests'));
  for (let i = 0; i < files.length; i++) {
    if (files[i].indexOf('.js') >= 0) {
      require(path.join(__dirname, 'tests', files[i]));
      // test({obnizA, obnizB});
    }
  }
});
