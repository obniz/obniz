const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');

let obnizA, obnizB;

describe('0-ad', function() {
  this.timeout(15000);

  before(function() {
    return new Promise(resolve => {
      config.waitForConenct(() => {
        obnizA = config.obnizA;
        obnizB = config.obnizB;
        resolve();
      });
    });
  });

  it('can detect low on io0-11', async function() {
    for (let i = 0; i < 12; i++) {
      obnizA.getIO(i).pull(null);
      obnizA.getIO(i).drive('5v');
    }

    for (let i = 0; i < 12; i++) {
      obnizA.getIO(i).output(false);
      await ioBisInRange(i, [0.0, 0.5]);
    }
  });

  it('can detect high on io0-11', async function() {
    for (let i = 0; i < 12; i++) {
      obnizA.getIO(i).output(true);
      await ioBisInRange(i, [4.0, 5.5]);
    }
  });

  it('can detect around 3v on io0-11', async function() {
    for (let i = 0; i < 12; i++) {
      obnizA.getIO(i).drive('3v');
      obnizA.getIO(i).output(true);
      await ioBisInRange(i, [2.5, 3.5]);
    }
  });
});

async function ioBisInRange(io, range) {
  await obnizA.pingWait();
  let voltage = await obnizB.getAD(io).getWait();
  expect(
    voltage,
    `expected io${io} ${voltage} is  ${range[0]} ~ ${range[1]}`
  ).to.be.within(range[0], range[1]);
}
