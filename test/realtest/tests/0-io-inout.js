const chai = require('chai');
const expect = chai.expect;

const config = require('../config.js');

let obnizA;
let obnizB;

describe('0-io-input', function() {
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

  // it("input callback works", async function () {

  //   var record = null;
  //   var callback = function(val) {
  //     record = val;
  //   }

  //   obnizA.getIO(0).output(false);
  //   await obnizA.pingWait();
  //   obnizB.getIO(0).input(callback);
  //   await obnizB.pingWait();
  //   await obnizB.wait(1000);
  //   expect(record).to.be.equal(false);

  //   obnizA.getIO(0).output(true);
  //   await obnizA.pingWait();
  //   await obnizB.pingWait();
  //   await obnizB.wait(1000);
  //   expect(record).to.be.equal(true);
  // });

  it('5v low', async function() {
    await ioAisB(0, false);
    await ioAisB(11, false);
  });

  it('5v low with pull up5', async function() {
    obnizA.getIO(0).pull('5v');
    await ioAisB(0, false);
    obnizA.getIO(11).pull('5v');
    await ioAisB(11, false);
  });

  it('5v low with pull up3', async function() {
    obnizA.getIO(0).pull('3v');
    await ioAisB(0, false);
    obnizA.getIO(11).pull('3v');
    await ioAisB(11, false);
  });

  it('5v low with pull down', async function() {
    obnizA.getIO(0).pull('0v');
    await ioAisB(0, false);
    obnizA.getIO(11).pull('0v');
    await ioAisB(11, false);
  });

  it('5v high', async function() {
    await ioAisB(0, true);
    await ioAisB(11, true);
  });

  it('5v high with pull up5', async function() {
    obnizA.getIO(0).pull('5v');
    await ioAisB(0, true);
    obnizA.getIO(11).pull('5v');
    await ioAisB(11, true);
  });

  it('5v high with pull up3', async function() {
    obnizA.getIO(0).pull('3v');
    await ioAisB(0, true);
    obnizA.getIO(11).pull('3v');
    await ioAisB(11, true);
  });

  it('5v high with pull down', async function() {
    obnizA.getIO(0).pull('0v');
    await ioAisB(0, true);
    obnizA.getIO(11).pull('0v');
    await ioAisB(11, true);
  });

  it('3v low', async function() {
    obnizA.getIO(0).pull(null);
    obnizA.getIO(0).drive('3v');
    await ioAisB(0, false);
    obnizA.getIO(11).pull(null);
    obnizA.getIO(11).drive('3v');
    await ioAisB(11, false);
  });

  it('3v high', async function() {
    obnizA.getIO(0).drive('3v');
    await ioAisB(0, true);
    obnizA.getIO(11).drive('3v');
    await ioAisB(11, true);
  });

  it('open-drain low is low (floating)', async function() {
    obnizA.getIO(0).pull(null);
    obnizA.getIO(0).drive('open-drain');
    await ioAisB(0, false);

    obnizA.getIO(11).pull(null);
    obnizA.getIO(11).drive('open-drain');
    await ioAisB(11, false);
  });

  it('open-drain low is low (pullup3)', async function() {
    obnizA.getIO(0).pull('3v');
    obnizA.getIO(0).drive('open-drain');
    await ioAisB(0, false);

    obnizA.getIO(11).pull('3v');
    obnizA.getIO(11).drive('open-drain');
    await ioAisB(11, false);
  });

  it('open-drain low is low (pullup5v)', async function() {
    obnizA.getIO(0).pull('5v');
    obnizA.getIO(0).drive('open-drain');
    await ioAisB(0, false);

    obnizA.getIO(11).pull('5v');
    obnizA.getIO(11).drive('open-drain');
    await ioAisB(11, false);
  });

  it('open-drain high is low (pulldown)', async function() {
    obnizA.getIO(0).pull('0v');
    obnizA.getIO(0).drive('open-drain');
    await ioAisB(0, true, false);

    obnizA.getIO(11).pull('0v');
    obnizA.getIO(11).drive('open-drain');
    await ioAisB(11, true, false);
  });

  it('open-drain high is high (pullup5)', async function() {
    obnizA.getIO(0).pull('5v');
    obnizA.getIO(0).drive('open-drain');
    await ioAisB(0, true);

    obnizA.getIO(11).pull('5v');
    obnizA.getIO(11).drive('open-drain');
    await ioAisB(11, true);
  });

  it('open-drain high is high (pullup3)', async function() {
    obnizA.getIO(0).pull('3v');
    obnizA.getIO(0).drive('open-drain');
    await ioAisB(0, true);

    obnizA.getIO(11).pull('3v');
    obnizA.getIO(11).drive('open-drain');
    await ioAisB(11, true);
  });
});

async function ioAisB(io, val, mustbe) {
  if (mustbe === undefined) {
    mustbe = val;
  }
  obnizA.getIO(io).output(val);
  await obnizA.pingWait();
  let valB = await obnizB.getIO(io).inputWait();
  expect(valB, `expected io${io} ${valB} is must be ${mustbe}`).to.be.equal(
    mustbe
  );
}
