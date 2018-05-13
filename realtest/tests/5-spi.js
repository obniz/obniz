const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');

let obnizA, obnizB;

describe('5-spi', function() {
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

  it('send-receive', async function() {
    let spi0 = obnizA.getFreeSpi();
    spi0.start({
      mode: 'master',
      clk: 0,
      mosi: 1,
      miso: 2,
      frequency: 1 * 1000 * 1000,
    });

    obnizB.io2.drive('5v');
    obnizB.io2.output(false);
    await obnizB.pingWait();
    let data = [];
    let expected = [];
    for (let i = 0; i < 32; i++) {
      data.push(0xcc);
      expected.push(0);
    }
    let ret = await spi0.writeWait(data);
    expect(ret).to.deep.equal(expected);

    obnizB.io2.output(true);
    await obnizB.pingWait();
    data = [];
    expected = [];
    for (let i = 0; i < 32; i++) {
      data.push(0xcc);
      expected.push(255);
    }
    ret = await spi0.writeWait(data);
    expect(ret).to.deep.equal(expected);

    spi0.end();
    obnizB.io2.input();
  });

  it('send-receive 26Mhz@3vz', async function() {
    let spi0 = obnizA.getFreeSpi();
    spi0.start({
      mode: 'master',
      clk: 0,
      mosi: 1,
      miso: 2,
      frequency: 26 * 1000 * 1000,
      drive: '3v',
    });

    obnizB.io2.drive('5v');
    obnizB.io2.output(false);
    await obnizB.pingWait();
    let data = [];
    let expected = [];
    for (let i = 0; i < 1024; i++) {
      data.push(0xcc);
      expected.push(0);
    }
    let ret = await spi0.writeWait(data);
    expect(ret).to.deep.equal(expected);

    obnizB.io2.output(true);
    await obnizB.pingWait();
    data = [];
    expected = [];
    for (let i = 0; i < 32; i++) {
      data.push(0xcc);
      expected.push(255);
    }
    ret = await spi0.writeWait(data);
    expect(ret).to.deep.equal(expected);

    spi0.end();
    obnizB.io2.input();
  });

  it('two port at same time', async function() {
    let spi0 = obnizA.getFreeSpi();
    let spi1 = obnizA.getFreeSpi();
    spi0.start({
      mode: 'master',
      clk: 0,
      mosi: 1,
      miso: 2,
      frequency: 1 * 1000 * 1000,
    });
    spi1.start({
      mode: 'master',
      clk: 3,
      mosi: 4,
      miso: 5,
      frequency: 1 * 1000 * 1000,
    });

    obnizB.io2.drive('5v');
    obnizB.io2.output(false);
    obnizB.io5.drive('5v');
    obnizB.io5.output(true);
    await obnizB.pingWait();
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
    obnizB.io2.input();
    obnizB.io5.input();
  });
});
