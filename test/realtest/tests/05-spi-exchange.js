const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');

let obnizA, checkBoard, check_io;

describe('5-spi-exchange', function () {
  this.timeout(30000);

  before(function () {
    return new Promise((resolve) => {
      config.waitForConenct(() => {
        obnizA = config.obnizA;
        checkBoard = config.checkBoard;
        check_io = config.check_io.filter(
          (io) =>
            io.obniz === 'obnizA' &&
            io.mode.some((mode) => mode === 'digitalWrite')
        );
        resolve();
      });
    });
  });

  afterEach(async () => {
    if (obnizA.spi0 && obnizA.spi0.isUsed()) {
      obnizA.spi0.end();
    }
    if (obnizA.spi1 && obnizA.spi1.isUsed()) {
      obnizA.spi1.end();
    }
    if (checkBoard.spi0 && checkBoard.spi0.isUsed()) {
      checkBoard.spi0.end();
    }
    if (checkBoard.spi1 && checkBoard.spi1.isUsed()) {
      checkBoard.spi1.end();
    }
  });

  it('send-receive', async function () {
    let spi0 = obnizA.getFreeSpi();
    spi0.start({
      mode: 'master',
      clk: check_io[0].obniz_io,
      mosi: check_io[1].obniz_io,
      miso: check_io[2].obniz_io,
      frequency: 1 * 1000 * 1000,
    });
    await obnizA.pingWait();
    checkBoard.getIO(check_io[2].board_io).drive('3v');
    checkBoard.getIO(check_io[2].board_io).output(false);
    await checkBoard.pingWait();
    let data = [];
    let expected = [];
    for (let i = 0; i < 32; i++) {
      data.push(0xcc);
      expected.push(0);
    }
    let ret = await spi0.writeWait(data);
    expect(ret).to.deep.equal(expected);

    checkBoard.getIO(check_io[2].board_io).output(true);
    await checkBoard.pingWait();
    data = [];
    expected = [];
    for (let i = 0; i < 32; i++) {
      data.push(0xcc);
      expected.push(255);
    }
    ret = await spi0.writeWait(data);
    expect(ret).to.deep.equal(expected);

    spi0.end();
    checkBoard.getIO(check_io[2].board_io).input();
  });

  it('send-receive 26Mhz@3vz', async function () {
    let spi0 = obnizA.getFreeSpi();
    spi0.start({
      mode: 'master',
      clk: check_io[0].obniz_io,
      mosi: check_io[1].obniz_io,
      miso: check_io[2].obniz_io,
      frequency: 26 * 1000 * 1000,
      drive: '3v',
    });

    checkBoard.getIO(check_io[2].board_io).drive('3v');
    checkBoard.getIO(check_io[2].board_io).output(false);
    await checkBoard.pingWait();
    let data = [];
    let expected = [];
    for (let i = 0; i < 1024; i++) {
      data.push(0xcc);
      expected.push(0);
    }
    let ret = await spi0.writeWait(data);
    expect(ret).to.deep.equal(expected);

    checkBoard.getIO(check_io[2].board_io).output(true);
    await checkBoard.pingWait();
    data = [];
    expected = [];
    for (let i = 0; i < 32; i++) {
      data.push(0xcc);
      expected.push(255);
    }
    ret = await spi0.writeWait(data);
    expect(ret).to.deep.equal(expected);

    spi0.end();
    checkBoard.getIO(check_io[2].board_io).input();
  });

  it('two port at same time', async function () {
    if (check_io.length < 6 || checkBoard.spi0 || checkBoard.spi1) {
      expect(true).to.be.true;
      return;
    }
    let spi0 = obnizA.getFreeSpi();
    let spi1 = obnizA.getFreeSpi();
    spi0.start({
      mode: 'master',
      clk: check_io[0].obniz_io,
      mosi: check_io[1].obniz_io,
      miso: check_io[2].obniz_io,
      frequency: 1 * 1000 * 1000,
    });
    spi1.start({
      mode: 'master',
      clk: check_io[3].obniz_io,
      mosi: check_io[4].obniz_io,
      miso: check_io[5].obniz_io,
      frequency: 1 * 1000 * 1000,
    });

    checkBoard.getIO(check_io[2].board_io).drive('3v');
    checkBoard.getIO(check_io[2].board_io).output(false);
    checkBoard.getIO(check_io[5].board_io).drive('3v');
    checkBoard.getIO(check_io[5].board_io).output(true);
    await checkBoard.pingWait();
    let data = [];
    let expected0 = [];
    let expected1 = [];
    for (let i = 0; i < 1024; i++) {
      data.push(0xcc);
      expected0.push(0);
      expected1.push(255);
    }
    let ret0 = await spi0.writeWait(data);
    let ret1 = await spi1.writeWait(data);
    expect(ret0).to.deep.equal(expected0);
    expect(ret1).to.deep.equal(expected1);

    spi0.end();
    spi1.end();
  });
});
