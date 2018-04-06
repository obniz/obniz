const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const sinon = require('sinon');
const path = require('path');
const fs = require('fs');

module.exports = function(config) {

  const obnizA = config.obnizA;
  const obnizB = config.obnizB;

  describe("io", function () {
  
    it("5v low", async function () {
      var valA = false;
      var io = 0
      obnizA.getIO(io).output(valA);
      await obnizA.pingWait();
      var valB = await obnizB.getIO(io).inputWait();
      expect(valA).to.be.equal(valB);
    });

    it("5v high", async function () {
      var valA = true;
      var io = 0
      obnizA.getIO(io).output(valA);
      await obnizA.pingWait();
      var valB = await obnizB.getIO(io).inputWait();
      expect(valA).to.be.equal(valB);
    });

    it("3v low", async function () {
      var valA = false;
      var io = 0;
      obnizA.getIO(io).drive("3v");
      obnizA.getIO(io).output(valA);
      await obnizA.pingWait();
      var valB = await obnizB.getIO(io).inputWait();
      expect(valA).to.be.equal(valB);
    });

    it("3v high", async function () {
      var valA = true;
      var io = 0
      obnizA.getIO(io).drive("3v");
      obnizA.getIO(io).output(valA);
      await obnizA.pingWait();
      var valB = await obnizB.getIO(io).inputWait();
      expect(valA).to.be.equal(valB);
    });
  
  });
  

}