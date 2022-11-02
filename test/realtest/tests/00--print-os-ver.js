const config = require('../config.js');

describe('00--print-os-ver', function () {
  this.timeout(15000);

  before(() => {
    return new Promise((resolve) => {
      config.waitForConenct(() => {
        resolve();
      });
    });
  });

  it('checkboard obniz', function () {
    if (!config.checkBoard) this.skip();
    printObnizData(config.checkBoard);
  });

  it('support obnizA', function () {
    if (!config.obnizA) this.skip();
    printObnizData(config.obnizA);
  });

  it('support obnizB', function () {
    if (!config.obnizB) this.skip();
    printObnizData(config.obnizB);
  });
});

const printObnizData = (obniz) => {
  const obnizData = {
    id: obniz.id,
    hw: obniz.hw,
    osver: obniz.firmware_ver,
  };
  console.log(`\n${JSON.stringify(obnizData, null, 2)}`);
};
