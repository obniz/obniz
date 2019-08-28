const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');

let esp32, check_io;

describe('2-io-animation', function() {
  this.timeout(20000);
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

  it('animation', async function() {
    esp32.io.animation('animation-1', 'loop', [
      {
        duration: 10,
        state: function() {
          esp32.getIO(check_io[0].esp32_io).output(false);
        },
      },
      {
        duration: 10,
        state: function() {
          esp32.getIO(check_io[0].esp32_io).output(true);
        },
      },
    ]);
    await esp32.pingWait();
    await detectPulse(check_io[0], [40, 60]);
  });

  it('animation pause', async function() {
    esp32.io.animation('animation-1', 'pause');
    await esp32.pingWait();

    await ioAisB(check_io[0], false);
    await ioAisB(check_io[0], true);
  });

  it('animation resume', async function() {
    esp32.io.animation('animation-1', 'resume');
    await esp32.pingWait();
    await detectPulse(check_io[0], [40, 60]);
  });

  it('animation remove', async function() {
    esp32.io.animation('animation-1', 'loop');
    await esp32.pingWait();

    await ioAisB(check_io[0], false);
    await ioAisB(check_io[0], true);
  });

  it('two animation', async function() {
    esp32.io.animation('animation-1', 'loop', [
      {
        duration: 10,
        state: function() {
          esp32.getIO(check_io[0].esp32_io).output(false);
        },
      },
      {
        duration: 10,
        state: function() {
          esp32.getIO(check_io[0].esp32_io).output(true);
        },
      },
    ]);
    esp32.io.animation('animation-2', 'loop', [
      {
        duration: 10,
        state: function() {
          esp32.getIO(check_io[1].esp32_io).output(false);
        },
      },
      {
        duration: 10,
        state: function() {
          esp32.getIO(check_io[1].esp32_io).output(true);
        },
      },
    ]);
    await esp32.pingWait();
    await detectPulse(check_io[0], [40, 60]);
    await detectPulse(check_io[1], [40, 60]);
    esp32.io.animation('animation-1', 'loop');
    esp32.io.animation('animation-2', 'loop');
  });
});

function detectPulse(device, ratioRange) {
  return new Promise((resolve, reject) => {
    let ignores = 0;
    let obniz = config.getDevice(device.obniz);
    obniz.logicAnalyzer.start({
      io: device.obniz_io,
      interval: 1,
      duration: 300,
    });
    obniz.logicAnalyzer.onmeasured = async function(array) {
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

      obniz.logicAnalyzer.end();
      await obniz.pingWait();
      resolve();
    };
  });
}

async function ioAisB(device, val, mustbe) {
  if (mustbe === undefined) {
    mustbe = val;
  }
  esp32.getIO(device.obniz_io).output(val);
  await esp32.pingWait();
  let obniz = config.getDevice(device.obniz);
  let valB = await obniz.getIO(device.obniz_io).inputWait();
  expect(valB).to.be.equal(mustbe);
}
