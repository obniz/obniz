const chai = require('chai');
const expect = chai.expect;
const config = require('../../realtest_esp32/config.js');

let obnizA, checkBoard, check_io;

describe('5-spi', function() {
  this.timeout(30000);

  before(function() {
    return new Promise(resolve => {
      config.waitForConenct(() => {
        obnizA = config.obnizA;
        checkBoard = config.checkBoard;
        check_io = config.check_io.filter(
          io =>
            io.obniz === 'obnizA' &&
            io.mode.some(mode => mode === 'digitalWrite')
        );
        resolve();
      });
    });
  });

  afterEach(async () => {
    if (checkBoard.spi0.isUsed()) {
      checkBoard.spi0.end();
    }
    if (checkBoard.spi1.isUsed()) {
      checkBoard.spi1.end();
    }
    if (obnizA.spi0.isUsed()) {
      obnizA.spi0.end();
    }
    if (obnizA.spi1.isUsed()) {
      obnizA.spi1.end();
    }
  });

  it('send-receive', async function() {
    let spi0 = checkBoard.getFreeSpi();
    spi0.start({
      mode: 'master',
      clk: check_io[0].board_io,
      mosi: check_io[1].board_io,
      miso: check_io[2].board_io,
      frequency: 1 * 1000 * 1000,
    });
    await checkBoard.pingWait();
    obnizA.getIO(check_io[2].obniz_io).drive('3v');
    obnizA.getIO(check_io[2].obniz_io).output(false);
    await obnizA.pingWait();
    let data = [];
    let expected = [];
    for (let i = 0; i < 32; i++) {
      data.push(0xcc);
      expected.push(0);
    }
    let ret = await spi0.writeWait(data);
    expect(ret).to.deep.equal(expected);

    obnizA.getIO(check_io[2].obniz_io).output(true);
    await obnizA.pingWait();
    data = [];
    expected = [];
    for (let i = 0; i < 32; i++) {
      data.push(0xcc);
      expected.push(255);
    }
    ret = await spi0.writeWait(data);
    expect(ret).to.deep.equal(expected);

    spi0.end();
    obnizA.getIO(check_io[2].obniz_io).input();
  });

  it('send-receive 26Mhz@3vz', async function() {
    let spi0 = checkBoard.getFreeSpi();
    spi0.start({
      mode: 'master',
      clk: check_io[0].board_io,
      mosi: check_io[1].board_io,
      miso: check_io[2].board_io,
      frequency: 26 * 1000 * 1000,
      drive: '3v',
    });

    obnizA.getIO(check_io[2].obniz_io).drive('3v');
    obnizA.getIO(check_io[2].obniz_io).output(false);
    await obnizA.pingWait();
    let data = [];
    let expected = [];
    for (let i = 0; i < 1024; i++) {
      data.push(0xcc);
      expected.push(0);
    }
    let ret = await spi0.writeWait(data);
    expect(ret).to.deep.equal(expected);

    obnizA.getIO(check_io[2].obniz_io).output(true);
    await obnizA.pingWait();
    data = [];
    expected = [];
    for (let i = 0; i < 32; i++) {
      data.push(0xcc);
      expected.push(255);
    }
    ret = await spi0.writeWait(data);
    expect(ret).to.deep.equal(expected);

    spi0.end();
    obnizA.getIO(check_io[2].obniz_io).input();
  });

  it('two port at same time', async function() {
    if (check_io.length < 6) {
      expect(true).to.be.true;
      return;
    }
    let spi0 = checkBoard.getFreeSpi();
    let spi1 = checkBoard.getFreeSpi();
    spi0.start({
      mode: 'master',
      clk: check_io[0].board_io,
      mosi: check_io[1].board_io,
      miso: check_io[2].board_io,
      frequency: 1 * 1000 * 1000,
    });
    spi1.start({
      mode: 'master',
      clk: check_io[3].board_io,
      mosi: check_io[4].board_io,
      miso: check_io[5].board_io,
      frequency: 1 * 1000 * 1000,
    });

    obnizA.getIO(check_io[2].obniz_io).drive('3v');
    obnizA.getIO(check_io[2].obniz_io).output(false);
    obnizA.getIO(check_io[5].obniz_io).drive('3v');
    obnizA.getIO(check_io[5].obniz_io).output(true);
    await obnizA.pingWait();
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
