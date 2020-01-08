const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');

let obnizA, checkBoard, check_io;

describe('6-i2c-exchange', function() {
  this.timeout(10000);

  before(function() {
    return new Promise(resolve => {
      config.waitForConenct(() => {
        obnizA = config.obnizA;
        checkBoard = config.checkBoard;
        check_io = config.check_io.filter(io => io.obniz === 'obnizA');
        resolve();
      });
    });
  });

  it('1k data', async function() {
    const sender = checkBoard.getFreeI2C();
    sender.start({
      mode: 'master',
      sda: check_io[0].board_io,
      scl: check_io[1].board_io,
      clock: 100 * 1000,
      pull: '5v',
    });
    await checkBoard.pingWait();
    const receiver = obnizA.getFreeI2C();
    receiver.start({
      mode: 'slave',
      sda: check_io[0].obniz_io,
      scl: check_io[1].obniz_io,
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
  });

  it('1k data again', async function() {
    const sender = checkBoard.getFreeI2C();
    sender.start({
      mode: 'master',
      sda: check_io[0].board_io,
      scl: check_io[1].board_io,
      clock: 100 * 1000,
      pull: '5v',
    });
    await checkBoard.pingWait();
    const receiver = obnizA.getFreeI2C();
    receiver.start({
      mode: 'slave',
      sda: check_io[0].obniz_io,
      scl: check_io[1].obniz_io,
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
  });

  it('1k data counter direction', async function() {
    const sender = obnizA.getFreeI2C();
    sender.start({
      mode: 'master',
      sda: check_io[0].obniz_io,
      scl: check_io[1].obniz_io,
      clock: 100 * 1000,
      pull: '5v',
    });
    await obnizA.pingWait();
    const receiver = checkBoard.getFreeI2C();
    receiver.start({
      mode: 'slave',
      sda: check_io[0].board_io,
      scl: check_io[1].board_io,
      clock: 100 * 1000,
      slave_address: 0x50,
      pull: '5v',
    });
    await checkBoard.pingWait();

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
    checkBoard.getIO(check_io[0].obniz_io).pull(null);
    checkBoard.getIO(check_io[1].obniz_io).pull(null);
    obnizA.getIO(check_io[0].board_io).pull(null);
    obnizA.getIO(check_io[1].board_io).pull(null);
  });
});

function wait(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
