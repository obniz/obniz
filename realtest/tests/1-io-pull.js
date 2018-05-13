const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');

let obnizA, obnizB;

describe('1-io-pull', function() {
  this.timeout(10000);
  before(function() {
    return new Promise(resolve => {
      config.waitForConenct(() => {
        obnizA = config.obnizA;
        obnizB = config.obnizB;
        resolve();
      });
    });
  });

  it('pulldown', async function() {
    obnizA.getIO(0).end();
    obnizA.getIO(0).input();
    obnizA.getIO(0).pull('0v');
    //await obnizA.wait(100);
    await ioBisInRange(0, [0.0, 0.5]);

    obnizA.getIO(11).end();
    obnizA.getIO(11).input();
    obnizA.getIO(11).pull('0v');
    //await obnizA.wait(100);
    await ioBisInRange(11, [0.0, 0.5]);
  });

  it('pullup 3v', async function() {
    obnizA.getIO(0).end();
    obnizA.getIO(0).input();
    obnizA.getIO(0).pull('3v');
    //await obnizA.wait(100);
    await ioBisInRange(0, [2.4, 3.4]);

    obnizA.getIO(11).end();
    obnizA.getIO(11).input();
    obnizA.getIO(11).pull('3v');
    //await obnizA.wait(100);
    await ioBisInRange(11, [2.4, 3.4]);
  });

  it('pullup 5v', async function() {
    obnizA.getIO(0).end();
    obnizA.getIO(0).input();
    obnizA.getIO(0).pull('5v');
    //await obnizA.wait(100);
    await ioBisInRange(0, [3.5, 5.5]);

    obnizA.getIO(11).end();
    obnizA.getIO(11).input();
    obnizA.getIO(11).pull('5v');
    //await obnizA.wait(100);
    await ioBisInRange(11, [3.5, 5.5]);
  });
});

async function ioBisInRange(io, range) {
  await obnizA.pingWait();
  let voltage = await obnizB.getAD(io).getWait();
  expect(voltage).to.be.within(range[0], range[1]);
}
