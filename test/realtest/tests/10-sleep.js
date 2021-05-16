const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');
/*
Sleep test

1. A:5v output B:5v check
2. A:10s sleep (poweroff = 0v) B:Read 0v check
3. A:sleep end 5v output B:5v check
*/

let checkBoard;
let obnizA;

describe('10-sleep', function () {
  this.timeout(40000);
  before(function () {
    if (!config.json.sleep_test) {
      this.skip();
    }
    return new Promise((resolve) => {
      config.waitForConenct(() => {
        checkBoard = config.checkBoard;
        obnizA = config.obnizA;
        resolve();
      });
    });
  });

  // step1
  it('setup', async () => {
    checkBoard.getIO(0).output(true);
    await checkBoard.pingWait();
    const valB = await obnizA.getIO(0).inputWait();
    expect(valB, `expected io0 ${valB} is must be true`).to.be.equal(true);
  });

  // step2
  it('sleep', async () => {
    checkBoard.sleepSeconds(5);
    obnizA.getIO(0).pull('0v');
    obnizA.getIO(0).drive('open-drain');
    await wait(3000); // sleep = Wait 3 seconds because we can't verify if the command was executed offline
    config.close(checkBoard);
    const voltage = await obnizA.getAD(0).getWait();
    expect(voltage, `expected io0 ${voltage} is  0 ~ 2`).to.be.within(0, 2);
  });

  // step3
  it('wakeup', async () => {
    await reconnect();
    await wait(1000);
    await checkBoard.pingWait();
    checkBoard.getIO(0).output(true);
    await checkBoard.pingWait();
    const valB = await obnizA.io0.inputWait();
    expect(valB, `expected io0 ${valB} is must be true`).to.be.equal(true);
    checkBoard.getIO(0).end();
  });

  // step4
  it('sleepIO sleep', async () => {
    checkBoard.sleepIoTrigger(true);
    config.close(checkBoard);
    await wait(3000); // sleep = Wait 3 seconds because we can't verify if the command was executed offline
    obnizA.io0.output(true); // wake up
    await obnizA.pingWait();
    obnizA.io0.end();
    await reconnect();
    await wait(1000);
    await checkBoard.pingWait();
    checkBoard.getIO(0).output(true);
    await checkBoard.pingWait();
    const valB = await obnizA.getIO(0).inputWait();
    expect(valB, `expected io0 ${valB} is must be true`).to.be.equal(true);
    checkBoard.getIO(0).end();
  });
});

const reconnect = () => {
  return new Promise((resolve) => {
    config.reboot(() => {
      checkBoard = config.checkBoard;
      obnizA = config.obnizA;
      // console.error('reboot finished');
      resolve();
    }, false);
  });
};

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
