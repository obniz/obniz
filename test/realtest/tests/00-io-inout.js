const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');

let checkBoard;
let check_io;
let check_read;

describe('0-io-input', function () {
  this.timeout(10000);

  before(async function () {
    await config.waitForConenct();
    checkBoard = config.checkBoard;
    check_io = config.check_io.filter((io) =>
      io.mode.some((mode) => mode === 'digitalWrite')
    );
    check_read = config.check_io.filter((io) =>
      io.mode.some((mode) => mode === 'digitalRead')
    );
    if (check_io.length === 0) {
      this.skip();
    }
  });

  it('checkBoard -> obniz 3v low', async () => {
    for (let i = 0; i < check_io.length; i++) {
      checkBoard.getIO(check_io[i].board_io).pull(null);
      checkBoard.getIO(check_io[i].board_io).drive('3v');
      await ioAisBWait(check_io[i], false);
    }
  });

  it('checkBoard -> obniz 3v high', async () => {
    for (let i = 0; i < check_io.length; i++) {
      checkBoard.getIO(check_io[i].board_io).drive('3v');
      await ioAisBWait(check_io[i], true);
    }
  });

  it('checkBoard <- obniz 3v low', async () => {
    for (let i = 0; i < check_read.length; i++) {
      await ioObnizisEspWait(check_read[i], false);
    }
  });

  it('checkBoard <- obniz 3v high', async () => {
    for (let i = 0; i < check_read.length; i++) {
      await ioObnizisEspWait(check_read[i], true);
    }
  });

  // todo: checkBoard 5v not supported
  // it('5v low with pull up5', async function () {
  //   checkBoard.getIO(check_io[0].board_io).pull('5v');
  //   await ioAisBWait(check_io[0], false);
  //   checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('5v');
  //   await ioAisBWait(check_io[check_io.length - 1], false);
  // });

  it('3v low with pull up3', async () => {
    checkBoard.getIO(check_io[0].board_io).pull('3v');
    await ioAisBWait(check_io[0], false);
    checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('3v');
    await ioAisBWait(check_io[check_io.length - 1], false);
  });

  it('3v low with pull down', async () => {
    checkBoard.getIO(check_io[0].board_io).pull('0v');
    await ioAisBWait(check_io[0], false);
    checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('0v');
    await ioAisBWait(check_io[check_io.length - 1], false);
  });

  it('3v high', async () => {
    await ioAisBWait(check_io[0], true);
    await ioAisBWait(check_io[check_io.length - 1], true);
  });
  // todo: checkBoard 5v not supported
  // it('5v high with pull up5', async function () {
  //   checkBoard.getIO(check_io[0].board_io).pull('5v');
  //   await ioAisBWait(check_io[0], true);
  //   checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('5v');
  //   await ioAisBWait(check_io[check_io.length - 1], true);
  // });

  it('3v high with pull up3', async () => {
    checkBoard.getIO(check_io[0].board_io).pull('3v');
    await ioAisBWait(check_io[0], true);
    checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('3v');
    await ioAisBWait(check_io[check_io.length - 1], true);
  });

  it('3v high with pull down', async () => {
    checkBoard.getIO(check_io[0].board_io).pull('0v');
    await ioAisBWait(check_io[0], true);
    checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('0v');
    await ioAisBWait(check_io[check_io.length - 1], true);
  });

  it('open-drain low is low (floating)', async () => {
    checkBoard.getIO(check_io[0].board_io).pull(null);
    checkBoard.getIO(check_io[0].board_io).drive('open-drain');
    await ioAisBWait(check_io[0], false);

    checkBoard.getIO(check_io[check_io.length - 1].board_io).pull(null);
    checkBoard
      .getIO(check_io[check_io.length - 1].board_io)
      .drive('open-drain');
    await ioAisBWait(check_io[check_io.length - 1], false);
  });

  it('open-drain low is low (pullup3)', async () => {
    checkBoard.getIO(check_io[0].board_io).pull('3v');
    checkBoard.getIO(check_io[0].board_io).drive('open-drain');
    await ioAisBWait(check_io[0], false);

    checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('3v');
    checkBoard
      .getIO(check_io[check_io.length - 1].board_io)
      .drive('open-drain');
    await ioAisBWait(check_io[check_io.length - 1], false);
  });
  // todo: checkBoard 5v not supported
  // it('open-drain low is low (pullup5v)', async function () {
  //   checkBoard.getIO(check_io[0].board_io).pull('5v');
  //   checkBoard.getIO(check_io[0].board_io).drive('open-drain');
  //   await ioAisBWait(check_io[0], false);

  //   checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('5v');
  //   checkBoard.getIO(check_io[check_io.length - 1].board_io).drive('open-drain');
  //   await ioAisBWait(check_io[check_io.length - 1], false);
  // });

  it('open-drain high is low (pulldown)', async () => {
    checkBoard.getIO(check_io[0].board_io).pull('0v');
    checkBoard.getIO(check_io[0].board_io).drive('open-drain');
    await ioAisBWait(check_io[0], true, false);

    checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('0v');
    checkBoard
      .getIO(check_io[check_io.length - 1].board_io)
      .drive('open-drain');
    await ioAisBWait(check_io[check_io.length - 1], true, false);
  });

  // todo: checkBoard 5v not supported
  // it('open-drain high is high (pullup5)', async function () {
  //   checkBoard.getIO(check_io[0].board_io).pull('5v');
  //   checkBoard.getIO(check_io[0].board_io).drive('open-drain');
  //   await ioAisBWait(check_io[0], true);

  //   checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('5v');
  //   checkBoard.getIO(check_io[check_io.length - 1].board_io).drive('open-drain');
  //   await ioAisBWait(check_io[check_io.length - 1], true);
  // });

  it('open-drain high is high (pullup3)', async () => {
    checkBoard.getIO(check_io[0].board_io).pull('3v');
    checkBoard.getIO(check_io[0].board_io).drive('open-drain');
    await ioAisBWait(check_io[0], true);
    checkBoard.getIO(check_io[0].board_io).end();

    checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('3v');
    checkBoard
      .getIO(check_io[check_io.length - 1].board_io)
      .drive('open-drain');
    await ioAisBWait(check_io[check_io.length - 1], true);
    checkBoard.getIO(check_io[check_io.length - 1].board_io).end();
  });
});

const ioAisBWait = async (io_config, val, mustbe) => {
  if (mustbe === undefined) {
    mustbe = val;
  }
  checkBoard.getIO(io_config.board_io).output(val);
  await checkBoard.pingWait();
  const obniz = config.getDevice(io_config.obniz);
  const valB = await obniz.getIO(io_config.obniz_io).inputWait();

  expect(
    valB,
    `expected io${io_config.board_io} ${valB} is must be ${mustbe}`
  ).to.be.equal(mustbe);
  checkBoard.getIO(io_config.board_io).end();
};

const ioObnizisEspWait = async (device, val, mustbe) => {
  if (mustbe === undefined) {
    mustbe = val;
  }
  const obniz = config.getDevice(device.obniz);
  obniz.getIO(device.obniz_io).pull(null);
  obniz.getIO(device.obniz_io).drive('3v');
  obniz.getIO(device.obniz_io).output(val);
  await obniz.pingWait();

  const valB = await checkBoard.getIO(device.board_io).inputWait();
  expect(
    valB,
    `expected io${device.board_io} ${valB} is must be ${mustbe}`
  ).to.be.equal(mustbe);
  obniz.getIO(device.obniz_io).end();
};
