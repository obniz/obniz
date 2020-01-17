const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');

let obnizA, obnizB;

describe('2-io-animation', function() {
  this.timeout(20000);
  before(function() {
    return new Promise(resolve => {
      config.waitForConenct(() => {
        obnizA = config.obnizA;
        obnizB = config.obnizB;
        resolve();
      });
    });
  });

  it('animation', async function() {
    obnizA.io.animation('animation-1', 'loop', [
      {
        duration: 10,
        state: function() {
          obnizA.io0.output(false);
        },
      },
      {
        duration: 10,
        state: function() {
          obnizA.io0.output(true);
        },
      },
    ]);
    await obnizA.pingWait();
    await detectPulse(0, [40, 60]);
  });

  it('animation pause', async function() {
    obnizA.io.animation('animation-1', 'pause');
    await obnizA.pingWait();

    await ioAisB(0, false);
    await ioAisB(0, true);
  });

  it('animation resume', async function() {
    obnizA.io.animation('animation-1', 'resume');
    await obnizA.pingWait();
    await detectPulse(0, [40, 60]);
  });

  it('animation remove', async function() {
    obnizA.io.animation('animation-1', 'loop');
    await obnizA.pingWait();

    await ioAisB(0, false);
    await ioAisB(0, true);
  });

  it('two animation', async function() {
    obnizA.io.animation('animation-1', 'loop', [
      {
        duration: 10,
        state: function() {
          obnizA.io0.output(false);
        },
      },
      {
        duration: 10,
        state: function() {
          obnizA.io0.output(true);
        },
      },
    ]);
    obnizA.io.animation('animation-2', 'loop', [
      {
        duration: 10,
        state: function() {
          obnizA.io1.output(false);
        },
      },
      {
        duration: 10,
        state: function() {
          obnizA.io1.output(true);
        },
      },
    ]);
    await obnizA.pingWait();
    await detectPulse(0, [40, 60]);
    await detectPulse(1, [40, 60]);
    obnizA.io.animation('animation-1', 'loop');
    obnizA.io.animation('animation-2', 'loop');
  });
});

function detectPulse(io, ratioRange) {
  return new Promise((resolve, reject) => {
    let ignores = 0;
    obnizB.logicAnalyzer.start({ io, interval: 1, duration: 300 });
    obnizB.logicAnalyzer.onmeasured = async function(array) {
      if (ignores > 0) {
        ignores--;
        return;
      }
      let ret = {};
      ret[0] = 0;
      ret[1] = 0;
      for (let i = 0; i < array.length; i++) {
        ret[array[i]]++;
      }
      try {
        expect((ret[1] / (ret[0] + ret[1])) * 100).to.be.within(
          ratioRange[0],
          ratioRange[1]
        ); // check only rate
      } catch (e) {
        reject(e);
      }

      obnizB.logicAnalyzer.end();
      await obnizB.pingWait();
      resolve();
    };
  });
}

async function ioAisB(io, val, mustbe) {
  if (mustbe === undefined) {
    mustbe = val;
  }
  obnizA.getIO(io).output(val);
  await obnizA.pingWait();
  let valB = await obnizB.getIO(io).inputWait();
  expect(valB).to.be.equal(mustbe);
}
