const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');

let checkBoard, check_io;

describe('1-io-pull', function () {
  this.timeout(10000);
  before(function () {
    return new Promise((resolve) => {
      config.waitForConenct(() => {
        checkBoard = config.checkBoard;
        check_io = config.check_io.filter((io) =>
          io.mode.some((mode) => mode === 'digitalWrite')
        );
        resolve();
      });
    });
  });

  it('pulldown', async function () {
    checkBoard.getIO(check_io[0].board_io).output(false);
    checkBoard.getIO(check_io[0].board_io).end();
    checkBoard.getIO(check_io[0].board_io).input();
    checkBoard.getIO(check_io[0].board_io).pull('0v');
    await checkBoard.wait(100);
    await ioBisInRangeWait(check_io[0], [0.0, 0.5]);

    checkBoard.getIO(check_io[check_io.length - 1].board_io).end();
    checkBoard.getIO(check_io[check_io.length - 1].board_io).input();
    checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('0v');
    //await checkBoard.wait(100);
    await ioBisInRangeWait(check_io[check_io.length - 1], [0.0, 0.5]);
  });

  it('pullup', async function () {
    checkBoard.getIO(check_io[0].board_io).end();
    checkBoard.getIO(check_io[0].board_io).input();
    checkBoard.getIO(check_io[0].board_io).pull('3v');
    //await checkBoard.wait(100);
    await ioBisInRangeWait(check_io[0], [2.4, 3.4]);

    checkBoard.getIO(check_io[check_io.length - 1].board_io).end();
    checkBoard.getIO(check_io[check_io.length - 1].board_io).input();
    checkBoard.getIO(check_io[check_io.length - 1].board_io).pull('3v');
    //await checkBoard.wait(100);
    await ioBisInRangeWait(check_io[check_io.length - 1], [2.4, 3.4]);
  });
});

async function ioBisInRangeWait(device, range) {
  await checkBoard.pingWait();
  let obniz = config.getDevice(device.obniz);
  let voltage = await obniz.getAD(device.obniz_io).getWait();

  expect(
    voltage,
    `expected io${device.board_io} ${voltage} is  ${range[0]} ~ ${range[1]}`
  ).to.be.within(range[0], range[1]);
}
