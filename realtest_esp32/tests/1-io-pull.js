const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');

let esp32, check_io;

describe('1-io-pull', function() {
  this.timeout(10000);
  before(function() {
    return new Promise(resolve => {
      config.waitForConenct(() => {
        esp32 = config.esp32;
        check_io = config.check_io.filter(io =>
          io.mode.some(mode => mode === config.mode.digitalWrite)
        );
        resolve();
      });
    });
  });

  it('pulldown', async function() {
    esp32.getIO(check_io[0].esp32_io).output(false);
    esp32.getIO(check_io[0].esp32_io).end();
    esp32.getIO(check_io[0].esp32_io).input();
    esp32.getIO(check_io[0].esp32_io).pull('0v');
    await esp32.wait(100);
    await ioBisInRange(check_io[0], [0.0, 0.5]);

    esp32.getIO(check_io[check_io.length - 1].esp32_io).end();
    esp32.getIO(check_io[check_io.length - 1].esp32_io).input();
    esp32.getIO(check_io[check_io.length - 1].esp32_io).pull('0v');
    //await esp32.wait(100);
    await ioBisInRange(check_io[check_io.length - 1], [0.0, 0.5]);
  });

  it('pullup', async function() {
    esp32.getIO(check_io[0].esp32_io).end();
    esp32.getIO(check_io[0].esp32_io).input();
    esp32.getIO(check_io[0].esp32_io).pull('3v');
    //await esp32.wait(100);
    await ioBisInRange(check_io[0], [2.4, 3.4]);

    esp32.getIO(check_io[check_io.length - 1].esp32_io).end();
    esp32.getIO(check_io[check_io.length - 1].esp32_io).input();
    esp32.getIO(check_io[check_io.length - 1].esp32_io).pull('3v');
    //await esp32.wait(100);
    await ioBisInRange(check_io[check_io.length - 1], [2.4, 3.4]);
  });
});

async function ioBisInRange(device, range) {
  await esp32.pingWait();
  let obniz = config.getDevice(device.obniz);
  let voltage = await obniz.getAD(device.obniz_io).getWait();

  expect(
    voltage,
    `expected io${device.esp32_io} ${voltage} is  ${range[0]} ~ ${range[1]}`
  ).to.be.within(range[0], range[1]);
}
