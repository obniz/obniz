const chai = require('chai');
const expect = chai.expect;
const config = require('../../realtest_esp32/config.js');

let checkBoard, check_io, check_read;

describe('0-io-input', function() {
  this.timeout(10000);

  before(function() {
    return new Promise(resolve => {
      config.waitForConenct(() => {
        checkBoard = config.checkBoard;
        check_io = config.check_io.filter(io =>
          io.mode.some(mode => mode === 'digitalWrite')
        );
        check_read = config.check_io.filter(io =>
          io.mode.some(mode => mode === 'digitalRead')
        );
        resolve();
      });
    });
  });

  it('checkBoard -> obniz 3v low', async function() {
    for (let i = 0; i < check_io.length; i++) {
      checkBoard.getIO(check_io[i].board_io).pull(null);
      checkBoard.getIO(check_io[i].board_io).drive('3v');
      await ioAisB(check_io[i], false);
    }
  });

  it('checkBoard -> obniz 3v high', async function() {
    for (let i = 0; i < check_io.length; i++) {
      checkBoard.getIO(check_io[i].board_io).drive('3v');
      await ioAisB(check_io[i], true);
    }
  });

  it('checkBoard <- obniz 3v low', async function() {
    for (let i = 0; i < check_read.length; i++) {
      await ioObnizisEsp(check_read[i], false);
    }
  });

  it('checkBoard <- obniz 3v high', async function() {
    for (let i = 0; i < check_read.length; i++) {
      await ioObnizisEsp(check_read[i], true);
    }
  });

  //todo: checkBoard 5v not supported
  // it('5v low with pull up5', async function () {
  //   checkBoard.getIO(check_io[0].board_io).pull('5v');
  //   await ioAisB(check_io[0], false);
  //   checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('5v');
  //   await ioAisB(check_io[check_io.length - 1], false);
  // });

  it('3v low with pull up3', async function() {
    checkBoard.getIO(check_io[0].board_io).pull('3v');
    await ioAisB(check_io[0], false);
    checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('3v');
    await ioAisB(check_io[check_io.length - 1], false);
  });

  it('3v low with pull down', async function() {
    checkBoard.getIO(check_io[0].board_io).pull('0v');
    await ioAisB(check_io[0], false);
    checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('0v');
    await ioAisB(check_io[check_io.length - 1], false);
  });

  it('3v high', async function() {
    await ioAisB(check_io[0], true);
    await ioAisB(check_io[check_io.length - 1], true);
  });
  //todo: checkBoard 5v not supported
  // it('5v high with pull up5', async function () {
  //   checkBoard.getIO(check_io[0].board_io).pull('5v');
  //   await ioAisB(check_io[0], true);
  //   checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('5v');
  //   await ioAisB(check_io[check_io.length - 1], true);
  // });

  it('3v high with pull up3', async function() {
    checkBoard.getIO(check_io[0].board_io).pull('3v');
    await ioAisB(check_io[0], true);
    checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('3v');
    await ioAisB(check_io[check_io.length - 1], true);
  });

  it('3v high with pull down', async function() {
    checkBoard.getIO(check_io[0].board_io).pull('0v');
    await ioAisB(check_io[0], true);
    checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('0v');
    await ioAisB(check_io[check_io.length - 1], true);
  });

  it('open-drain low is low (floating)', async function() {
    checkBoard.getIO(check_io[0].board_io).pull(null);
    checkBoard.getIO(check_io[0].board_io).drive('open-drain');
    await ioAisB(check_io[0], false);

    checkBoard.getIO(check_io[check_io.length - 1].board_io).pull(null);
    checkBoard
      .getIO(check_io[check_io.length - 1].board_io)
      .drive('open-drain');
    await ioAisB(check_io[check_io.length - 1], false);
  });

  it('open-drain low is low (pullup3)', async function() {
    checkBoard.getIO(check_io[0].board_io).pull('3v');
    checkBoard.getIO(check_io[0].board_io).drive('open-drain');
    await ioAisB(check_io[0], false);

    checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('3v');
    checkBoard
      .getIO(check_io[check_io.length - 1].board_io)
      .drive('open-drain');
    await ioAisB(check_io[check_io.length - 1], false);
  });
  //todo: checkBoard 5v not supported
  // it('open-drain low is low (pullup5v)', async function () {
  //   checkBoard.getIO(check_io[0].board_io).pull('5v');
  //   checkBoard.getIO(check_io[0].board_io).drive('open-drain');
  //   await ioAisB(check_io[0], false);

  //   checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('5v');
  //   checkBoard.getIO(check_io[check_io.length - 1].board_io).drive('open-drain');
  //   await ioAisB(check_io[check_io.length - 1], false);
  // });

  it('open-drain high is low (pulldown)', async function() {
    checkBoard.getIO(check_io[0].board_io).pull('0v');
    checkBoard.getIO(check_io[0].board_io).drive('open-drain');
    await ioAisB(check_io[0], true, false);

    checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('0v');
    checkBoard
      .getIO(check_io[check_io.length - 1].board_io)
      .drive('open-drain');
    await ioAisB(check_io[check_io.length - 1], true, false);
  });

  //todo: checkBoard 5v not supported
  // it('open-drain high is high (pullup5)', async function () {
  //   checkBoard.getIO(check_io[0].board_io).pull('5v');
  //   checkBoard.getIO(check_io[0].board_io).drive('open-drain');
  //   await ioAisB(check_io[0], true);

  //   checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('5v');
  //   checkBoard.getIO(check_io[check_io.length - 1].board_io).drive('open-drain');
  //   await ioAisB(check_io[check_io.length - 1], true);
  // });

  it('open-drain high is high (pullup3)', async function() {
    checkBoard.getIO(check_io[0].board_io).pull('3v');
    checkBoard.getIO(check_io[0].board_io).drive('open-drain');
    await ioAisB(check_io[0], true);
    checkBoard.getIO(check_io[0].board_io).end();

    checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('3v');
    checkBoard
      .getIO(check_io[check_io.length - 1].board_io)
      .drive('open-drain');
    await ioAisB(check_io[check_io.length - 1], true);
    checkBoard.getIO(check_io[check_io.length - 1].board_io).end();
  });
});

async function ioAisB(io_config, val, mustbe) {
  if (mustbe === undefined) {
    mustbe = val;
  }
  checkBoard.getIO(io_config.board_io).output(val);
  await checkBoard.pingWait();
  let obniz = config.getDevice(io_config.obniz);
  let valB = await obniz.getIO(io_config.obniz_io).inputWait();

  expect(
    valB,
    `expected io${io_config.board_io} ${valB} is must be ${mustbe}`
  ).to.be.equal(mustbe);
  checkBoard.getIO(io_config.board_io).end();
}

async function ioObnizisEsp(device, val, mustbe) {
  if (mustbe === undefined) {
    mustbe = val;
  }
  let obniz = config.getDevice(device.obniz);
  obniz.getIO(device.obniz_io).pull(null);
  obniz.getIO(device.obniz_io).drive('3v');
  obniz.getIO(device.obniz_io).output(val);
  await obniz.pingWait();

  let valB = await checkBoard.getIO(device.board_io).inputWait();
  expect(
    valB,
    `expected io${device.board_io} ${valB} is must be ${mustbe}`
  ).to.be.equal(mustbe);
  obniz.getIO(device.obniz_io).end();
}
