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

    this.timeout(20000);

    it("animation", function (done) {
      obnizA.io.animation("animation-1", "loop", [
        {
          duration: 10,
          state: function(index){ // index = 0
            obnizA.io0.output(false)
          }
        },{
          duration: 10,
          state: function(index){ // index = 1
            obnizA.io0.output(true)
          }
        }
      ]);

      var ignores = 1;

      obnizB.logicAnalyzer.start({io:0, interval:1, duration:100}); 
      obnizB.logicAnalyzer.onmeasured = async function(array) {
        if (ignores > 0) {
          ignores--;
          return;
        }
        var ret = { }
        ret[0] = 0;
        ret[1] = 0;
        for (var i=0; i<array.length; i++) {
          ret[array[i]]++;
        }
        expect(ret[0]).to.be.within(40, 60); // 割合だけ見る。パターンは間違っているかもしれない。

        obnizB.logicAnalyzer.end();
        await obnizB.pingWait();
        done();
      }
    });

    it("animation remove", async function () {
      obnizA.io.animation("animation-1", "loop");
      await obnizA.pingWait();

      await ioAisB(0, false) // ioanimationが動いている場合は、outputしても上書きされてしまい値が一致しないというのが起こる。
      await ioAisB(0, true)
    });
    

  });

  async function ioAisB(io, val, mustbe) {
    if (mustbe === undefined) {
      mustbe = val
    }
    obnizA.getIO(io).output(val);
    await obnizA.pingWait();
    var valB = await obnizB.getIO(io).inputWait();
    expect(valB).to.be.equal(mustbe);
  }
  

}