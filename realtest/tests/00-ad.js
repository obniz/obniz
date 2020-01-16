const chai = require('chai');
const expect = chai.expect;

const config = require('../config.js');

let checkBoard, check_output_io, check_input_io;
describe('0-ad', function() {
  this.timeout(15000);

  before(() => {
    return new Promise(resolve => {
      config.waitForConenct(() => {
        checkBoard = config.checkBoard;
        check_output_io = config.check_io.filter(io =>
          io.mode.some(mode => mode === 'digitalWrite')
        );
        check_input_io = config.check_io.filter(io =>
          io.mode.some(mode => mode === 'analogRead')
        );
        resolve();
      });
    });
  });

  it('checkBoard -> obniz can detect low on io check', async () => {
    for (let i = 0; i < check_output_io.length; i++) {
      await ioInRange(
        checkBoard,
        check_output_io[i].board_io,
        config.getDevice(check_output_io[i].obniz),
        check_output_io[i].obniz_io,
        false,
        [0.0, 0.5]
      );
    }
  });

  it('checkBoard -> obniz can detect high on io check', async () => {
    for (let i = 0; i < check_output_io.length; i++) {
      await ioInRange(
        checkBoard,
        check_output_io[i].board_io,
        config.getDevice(check_output_io[i].obniz),
        check_output_io[i].obniz_io,
        true,
        [2.5, 3.5]
      );
    }
  });

  it('checkBoard <- obniz can detect low on io check', async () => {
    for (let i = 0; i < check_input_io.length; i++) {
      await ioInRange(
        config.getDevice(check_input_io[i].obniz),
        check_input_io[i].obniz_io,
        checkBoard,
        check_input_io[i].board_io,
        false,
        [0.0, 0.5]
      );
    }
  });

  it('checkBoard <- obniz can detect high on io check', async () => {
    for (let i = 0; i < check_input_io.length; i++) {
      await ioInRange(
        config.getDevice(check_input_io[i].obniz),
        check_input_io[i].obniz_io,
        checkBoard,
        check_input_io[i].board_io,
        true,
        [2.5, 3.5]
      );
    }
  });
});

async function ioInRange(out_dev, out_io, in_dev, in_io, out_val, range) {
  out_dev.getIO(out_io).end();
  out_dev.getIO(out_io).drive('3v');
  out_dev.getIO(out_io).output(out_val);
  await out_dev.pingWait();
  let voltage = await in_dev.getAD(in_io).getWait();
  expect(
    voltage,
    `expected io${out_io} -> io${in_io} ${voltage} is ${range[0]} ~ ${range[1]}`
  ).to.be.within(range[0], range[1]);
  out_dev.getIO(out_io).end();
}
