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

    it("can detect low on io0-11", async function () {
      for (var i=0; i<12; i++) {
        obnizA.getIO(i).pull(null);
        obnizA.getIO(i).drive("5v");
      }

      for (var i=0; i<12; i++) {
        obnizA.getIO(i).output(false);
        await ioBisInRange(i, [0.0, 0.5]);
      }

    });

    it("can detect high on io0-11", async function () {
      for (var i=0; i<12; i++) {
        obnizA.getIO(i).output(true);
        await ioBisInRange(i, [4.0, 5.5]);
      }
    });

    it("can detect around 3v on io0-11", async function () {
      for (var i=0; i<12; i++) {
        obnizA.getIO(i).drive("3v");
        obnizA.getIO(i).output(true);
        await ioBisInRange(i, [2.5, 3.5]);
      }
    });
    
  });
  
  async function ioBisInRange(io, range) {
    await obnizA.pingWait();
    var voltage = await obnizB.getAD(io).getWait();
    expect(voltage).to.be.within(range[0], range[1]);
  }

}