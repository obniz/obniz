const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');

let obnizA, obnizB;

describe('6-i2c', function() {
  this.timeout(10000);

  before(function() {
    return new Promise(resolve => {
      config.waitForConenct(() => {
        obnizA = config.obnizA;
        obnizB = config.obnizB;
        obnizA.io11.output(true);
        resolve();
      });
    });
  });

  it('1k data', async function() {
    const sender = obnizA.getFreeI2C();
    sender.start({
      mode: 'master',
      sda: 0,
      scl: 1,
      clock: 100 * 1000,
      pull: '5v',
    });
    await obnizA.pingWait();
    const receiver = obnizB.getFreeI2C();
    receiver.start({
      mode: 'slave',
      sda: 0,
      scl: 1,
      clock: 100 * 1000,
      slave_address: 0x50,
      pull: '5v',
    });
    await obnizB.pingWait();

    let data = [];
    for (let i = 0; i < 1024; i++) {
      data.push(i % 256);
    }
    sender.write(0x50, data);

    let received = [];
    receiver.onwritten = function(arrived) {
      received.push(...arrived);
    };

    while (1) {
      if (data.length === received.length) {
        expect(received).to.deep.equal(data);
        break;
      }
      await wait(1); //wait for 10ms
    }
    receiver.end();
    sender.end();
  });

  it('1k data again', async function() {
    const sender = obnizA.getFreeI2C();
    sender.start({
      mode: 'master',
      sda: 0,
      scl: 1,
      clock: 100 * 1000,
      pull: '5v',
    });
    await obnizA.pingWait();
    const receiver = obnizB.getFreeI2C();
    receiver.start({
      mode: 'slave',
      sda: 0,
      scl: 1,
      clock: 100 * 1000,
      slave_address: 0x50,
      pull: '5v',
    });
    await obnizB.pingWait();

    let data = [];
    for (let i = 0; i < 1024; i++) {
      data.push(i % 256);
    }
    sender.write(0x50, data);

    let received = [];
    receiver.onwritten = function(arrived) {
      received.push(...arrived);
    };

    while (1) {
      if (data.length === received.length) {
        expect(received).to.deep.equal(data);
        break;
      }
      await wait(1); //wait for 10ms
    }
    receiver.end();
    sender.end();
  });

  it('1k data counter direction', async function() {
    const sender = obnizB.getFreeI2C();
    sender.start({
      mode: 'master',
      sda: 0,
      scl: 1,
      clock: 100 * 1000,
      pull: '5v',
    });
    await obnizB.pingWait();
    const receiver = obnizA.getFreeI2C();
    receiver.start({
      mode: 'slave',
      sda: 0,
      scl: 1,
      clock: 100 * 1000,
      slave_address: 0x50,
      pull: '5v',
    });
    await obnizA.pingWait();

    let data = [];
    for (let i = 0; i < 1024; i++) {
      data.push(i % 256);
    }
    sender.write(0x50, data);

    let received = [];
    receiver.onwritten = function(arrived) {
      received.push(...arrived);
    };

    while (1) {
      if (data.length === received.length) {
        expect(received).to.deep.equal(data);
        break;
      }
      await wait(1); //wait for 10ms
    }
    receiver.end();
    sender.end();
    obnizA.io0.pull(null);
    obnizA.io1.pull(null);
    obnizB.io0.pull(null);
    obnizB.io1.pull(null);
  });
});

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
