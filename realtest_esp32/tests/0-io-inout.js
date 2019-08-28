const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');

let esp32, check_io, check_read;

describe('0-io-input', function() {
  this.timeout(10000);

  before(function() {
    return new Promise(resolve => {
      config.waitForConenct(() => {
        esp32 = config.esp32;
        check_io = config.check_io.filter(io =>
          io.mode.some(mode => mode === config.mode.digitalWrite)
        );
        check_read = config.check_io.filter(io =>
          io.mode.some(mode => mode === config.mode.digitalRead)
        );
        resolve();
      });
    });
  });

  it('esp32 -> obniz 3v low', async function() {
    for (let i = 0; i < check_io.length; i++) {
      esp32.getIO(check_io[i].esp32_io).pull(null);
      esp32.getIO(check_io[i].esp32_io).drive('3v');
      await ioAisB(check_io[i], false);
    }
  });

  it('esp32 -> obniz 3v high', async function() {
    for (let i = 0; i < check_io.length; i++) {
      esp32.getIO(check_io[i].esp32_io).drive('3v');
      await ioAisB(check_io[i], true);
    }
  });

  it('esp32 <- obniz 3v low', async function() {
    for (let i = 0; i < check_read.length; i++) {
      await ioObnizisEsp(check_read[i], false);
    }
  });

  it('esp32 <- obniz 3v high', async function() {
    for (let i = 0; i < check_read.length; i++) {
      await ioObnizisEsp(check_read[i], true);
    }
  });

  //todo: esp32 5v not supported
  // it('5v low with pull up5', async function () {
  //   esp32.getIO(check_io[0].esp32_io).pull('5v');
  //   await ioAisB(check_io[0], false);
  //   esp32.getIO(check_io[check_io.length - 1].esp32_io).pull('5v');
  //   await ioAisB(check_io[check_io.length - 1], false);
  // });

  it('3v low with pull up3', async function() {
    esp32.getIO(check_io[0].esp32_io).pull('3v');
    await ioAisB(check_io[0], false);
    esp32.getIO(check_io[check_io.length - 1].esp32_io).pull('3v');
    await ioAisB(check_io[check_io.length - 1], false);
  });

  it('3v low with pull down', async function() {
    esp32.getIO(check_io[0].esp32_io).pull('0v');
    await ioAisB(check_io[0], false);
    esp32.getIO(check_io[check_io.length - 1].esp32_io).pull('0v');
    await ioAisB(check_io[check_io.length - 1], false);
  });

  it('3v high', async function() {
    await ioAisB(check_io[0], true);
    await ioAisB(check_io[check_io.length - 1], true);
  });
  //todo: esp32 5v not supported
  // it('5v high with pull up5', async function () {
  //   esp32.getIO(check_io[0].esp32_io).pull('5v');
  //   await ioAisB(check_io[0], true);
  //   esp32.getIO(check_io[check_io.length - 1].esp32_io).pull('5v');
  //   await ioAisB(check_io[check_io.length - 1], true);
  // });

  it('3v high with pull up3', async function() {
    esp32.getIO(check_io[0].esp32_io).pull('3v');
    await ioAisB(check_io[0], true);
    esp32.getIO(check_io[check_io.length - 1].esp32_io).pull('3v');
    await ioAisB(check_io[check_io.length - 1], true);
  });

  it('3v high with pull down', async function() {
    esp32.getIO(check_io[0].esp32_io).pull('0v');
    await ioAisB(check_io[0], true);
    esp32.getIO(check_io[check_io.length - 1].esp32_io).pull('0v');
    await ioAisB(check_io[check_io.length - 1], true);
  });

  it('open-drain low is low (floating)', async function() {
    esp32.getIO(check_io[0].esp32_io).pull(null);
    esp32.getIO(check_io[0].esp32_io).drive('open-drain');
    await ioAisB(check_io[0], false);

    esp32.getIO(check_io[check_io.length - 1].esp32_io).pull(null);
    esp32.getIO(check_io[check_io.length - 1].esp32_io).drive('open-drain');
    await ioAisB(check_io[check_io.length - 1], false);
  });

  it('open-drain low is low (pullup3)', async function() {
    esp32.getIO(check_io[0].esp32_io).pull('3v');
    esp32.getIO(check_io[0].esp32_io).drive('open-drain');
    await ioAisB(check_io[0], false);

    esp32.getIO(check_io[check_io.length - 1].esp32_io).pull('3v');
    esp32.getIO(check_io[check_io.length - 1].esp32_io).drive('open-drain');
    await ioAisB(check_io[check_io.length - 1], false);
  });
  //todo: esp32 5v not supported
  // it('open-drain low is low (pullup5v)', async function () {
  //   esp32.getIO(check_io[0].esp32_io).pull('5v');
  //   esp32.getIO(check_io[0].esp32_io).drive('open-drain');
  //   await ioAisB(check_io[0], false);

  //   esp32.getIO(check_io[check_io.length - 1].esp32_io).pull('5v');
  //   esp32.getIO(check_io[check_io.length - 1].esp32_io).drive('open-drain');
  //   await ioAisB(check_io[check_io.length - 1], false);
  // });

  it('open-drain high is low (pulldown)', async function() {
    esp32.getIO(check_io[0].esp32_io).pull('0v');
    esp32.getIO(check_io[0].esp32_io).drive('open-drain');
    await ioAisB(check_io[0], true, false);

    esp32.getIO(check_io[check_io.length - 1].esp32_io).pull('0v');
    esp32.getIO(check_io[check_io.length - 1].esp32_io).drive('open-drain');
    await ioAisB(check_io[check_io.length - 1], true, false);
  });

  //todo: esp32 5v not supported
  // it('open-drain high is high (pullup5)', async function () {
  //   esp32.getIO(check_io[0].esp32_io).pull('5v');
  //   esp32.getIO(check_io[0].esp32_io).drive('open-drain');
  //   await ioAisB(check_io[0], true);

  //   esp32.getIO(check_io[check_io.length - 1].esp32_io).pull('5v');
  //   esp32.getIO(check_io[check_io.length - 1].esp32_io).drive('open-drain');
  //   await ioAisB(check_io[check_io.length - 1], true);
  // });

  it('open-drain high is high (pullup3)', async function() {
    esp32.getIO(check_io[0].esp32_io).pull('3v');
    esp32.getIO(check_io[0].esp32_io).drive('open-drain');
    await ioAisB(check_io[0], true);
    esp32.getIO(check_io[0].esp32_io).end();

    esp32.getIO(check_io[check_io.length - 1].esp32_io).pull('3v');
    esp32.getIO(check_io[check_io.length - 1].esp32_io).drive('open-drain');
    await ioAisB(check_io[check_io.length - 1], true);
    esp32.getIO(check_io[check_io.length - 1].esp32_io).end();
  });
});

async function ioAisB(io_config, val, mustbe) {
  if (mustbe === undefined) {
    mustbe = val;
  }
  esp32.getIO(io_config.esp32_io).output(val);
  await esp32.pingWait();
  let obniz = config.getDevice(io_config.obniz);
  let valB = await obniz.getIO(io_config.obniz_io).inputWait();

  expect(
    valB,
    `expected io${io_config.esp32_io} ${valB} is must be ${mustbe}`
  ).to.be.equal(mustbe);
  esp32.getIO(io_config.esp32_io).end();
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

  let valB = await esp32.getIO(device.esp32_io).inputWait();
  expect(
    valB,
    `expected io${device.esp32_io} ${valB} is must be ${mustbe}`
  ).to.be.equal(mustbe);
  obniz.getIO(device.obniz_io).end();
}
