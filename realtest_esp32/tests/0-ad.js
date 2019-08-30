const chai = require('chai');
const expect = chai.expect;

const config = require('../config.js');

let esp32, check_output_io, check_input_io;
describe('0-ad', function() {
  this.timeout(15000);

  before(() => {
    return new Promise(resolve => {
      config.waitForConenct(() => {
        esp32 = config.esp32;
        check_output_io = config.check_io.filter(io =>
          io.mode.some(mode => mode === config.mode.digitalWrite)
        );
        check_input_io = config.check_io.filter(io =>
          io.mode.some(mode => mode === config.mode.analogRead)
        );
        resolve();
      });
    });
  });

  it('esp32 -> obniz can detect low on io check', async () => {
    for (let i = 0; i < check_output_io.length; i++) {
      await ioEspisInRange(
        config.getDevice(check_output_io[i].obniz),
        check_output_io[i].obniz_io,
        check_output_io[i].esp32_io,
        false,
        [0.0, 0.5]
      );
    }
  });

  it('esp32 -> obniz can detect high on io check', async () => {
    for (let i = 0; i < check_output_io.length; i++) {
      await ioEspisInRange(
        config.getDevice(check_output_io[i].obniz),
        check_output_io[i].obniz_io,
        check_output_io[i].esp32_io,
        true,
        [2.5, 3.5]
      );
    }
  });

  it('esp32 <- obniz can detect low on io check', async () => {
    for (let i = 0; i < check_input_io.length; i++) {
      await ioObnizisInRange(
        config.getDevice(check_input_io[i].obniz),
        check_input_io[i].esp32_io,
        check_input_io[i].obniz_io,
        false,
        [0.0, 0.5]
      );
    }
  });

  it('esp32 <- obniz can detect high on io check', async () => {
    for (let i = 0; i < check_input_io.length; i++) {
      await ioObnizisInRange(
        config.getDevice(check_input_io[i].obniz),
        check_input_io[i].esp32_io,
        check_input_io[i].obniz_io,
        true,
        [2.5, 3.5]
      );
    }
  });
});

async function ioEspisInRange(obniz, read_io, write_io, output_val, range) {
  esp32.getIO(write_io).end();
  esp32.getIO(write_io).output(output_val);
  await esp32.pingWait();
  let voltage = await obniz.getAD(read_io).getWait();
  expect(
    voltage,
    `expected io${write_io} ${voltage} is  ${range[0]} ~ ${range[1]}`
  ).to.be.within(range[0], range[1]);
  esp32.getIO(write_io).end();
}

async function ioObnizisInRange(obniz, read_io, write_io, output_val, range) {
  obniz.getIO(write_io).drive('3v');
  obniz.getIO(write_io).output(output_val);
  await obniz.pingWait();
  let voltage = await esp32.getAD(read_io).getWait();
  expect(
    voltage,
    `expected io${read_io} ${voltage} is  ${range[0]} ~ ${range[1]}`
  ).to.be.within(range[0], range[1]);
  obniz.getIO(write_io).end();
}
