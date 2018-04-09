const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const sinon = require('sinon');
const path = require('path');
const fs = require('fs');

module.exports = async function(config) {

  const obnizA = config.obnizA;
  const obnizB = config.obnizB;

  describe(path.basename(__filename), function () {

    this.timeout(10000);

    it("pulldown", async function () {
      obnizA.getIO(0).pull("0v");
      obnizA.getIO(0).end();
      await ioBisInRange(0, [0.0, 0.5]);

      obnizA.getIO(11).pull("0v");
      obnizA.getIO(11).end();
      await ioBisInRange(11, [0.0, 0.5]);
    });

    it("pullup 3v", async function () {
      obnizA.getIO(0).pull("3v");
      obnizA.getIO(0).end();
      await ioBisInRange(0, [2.4, 3.4]);

      obnizA.getIO(11).pull("3v");
      obnizA.getIO(11).end();
      await ioBisInRange(11, [2.4, 3.4]);
    });

    it("pullup 5v", async function () {
      obnizA.getIO(0).pull("5v");
      obnizA.getIO(0).end();
      await ioBisInRange(0, [3.5, 5.5]);

      obnizA.getIO(11).pull("5v");
      obnizA.getIO(11).end();
      await ioBisInRange(11, [3.5, 5.5]);
    });
    
  });
  
  async function ioBisInRange(io, range) {
    await obnizA.pingWait();
    var voltage = await obnizB.getAD(io).getWait();
    expect(voltage).to.be.within(range[0], range[1]);
  }

}