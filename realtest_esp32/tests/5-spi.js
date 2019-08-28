const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');

let obnizA, esp32, check_io;

describe('5-spi', function() {
  this.timeout(10000);

  before(function() {
    return new Promise(resolve => {
      config.waitForConenct(() => {
        obnizA = config.obnizA;
        esp32 = config.esp32;
        check_io = config.check_io.filter(io => io.obniz === 'obnizA');
        resolve();
      });
    });
  });

  it('send-receive', async function() {
    let spi0 = esp32.getFreeSpi();
    spi0.start({
      mode: 'master',
      clk: check_io[0].esp32_io,
      mosi: check_io[1].esp32_io,
      miso: check_io[2].esp32_io,
      frequency: 1 * 1000 * 1000,
    });

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
    let spi0 = esp32.getFreeSpi();
    spi0.start({
      mode: 'master',
      clk: check_io[0].esp32_io,
      mosi: check_io[1].esp32_io,
      miso: check_io[2].esp32_io,
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
    let spi0 = esp32.getFreeSpi();
    let spi1 = esp32.getFreeSpi();
    spi0.start({
      mode: 'master',
      clk: check_io[0].esp32_io,
      mosi: check_io[1].esp32_io,
      miso: check_io[2].esp32_io,
      frequency: 1 * 1000 * 1000,
    });
    spi1.start({
      mode: 'master',
      clk: check_io[3].esp32_io,
      mosi: check_io[4].esp32_io,
      miso: check_io[5].esp32_io,
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
