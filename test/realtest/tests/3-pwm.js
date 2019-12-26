const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');

let obnizA, obnizB;

describe('3-pwm', function() {
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

  let pwms = new Array(6);

  it('10%', async function() {
    const pwm = obnizA.getFreePwm();
    pwm.start({ io: 0 }); // start pwm. output at io0
    pwm.freq(100);
    pwm.duty(10);
    await obnizA.pingWait();
    await detectPulse(0, [0, 20]);
    pwm.end();
  });

  it('50%', async function() {
    const pwm = obnizA.getFreePwm();
    pwm.start({ io: 0 }); // start pwm. output at io0
    pwm.freq(100);
    pwm.duty(50);
    await obnizA.pingWait();
    await detectPulse(0, [40, 60]);
    pwm.end();
  });

  it('90%', async function() {
    const pwm = obnizA.getFreePwm();
    pwm.start({ io: 0 }); // start pwm. output at io0
    pwm.freq(100);
    pwm.duty(90);
    await obnizA.pingWait();
    await detectPulse(0, [80, 100]);
    pwm.end();
  });

  it('six pwm', async function() {
    for (let i = 0; i < 6; i++) {
      let pwm = obnizA.getFreePwm();
      pwm.start({ io: i * 2 }); // start pwm. output at io0
      pwm.freq(100 * (i + 1));
      pwm.duty(30 + i * 10);
      pwms[i] = pwm;
    }
    await obnizA.pingWait();
  });

  it('pwm0 = duty 30', async function() {
    await detectPulse(0, [20, 40]);
  });

  it('pwm1 = duty 40', async function() {
    await detectPulse(2, [30, 50]);
  });

  it('pwm2 = duty 50', async function() {
    await detectPulse(4, [40, 60]);
  });

  it('pwm3 = duty 60', async function() {
    await detectPulse(6, [50, 70]);
  });

  it('pwm4 = duty 70', async function() {
    await detectPulse(8, [60, 80]);
  });

  it('pwm5 = duty 80', async function() {
    await detectPulse(10, [70, 90]);
  });

  it('terminate successfull', async function() {
    for (let i = 0; i < pwms.length; i++) {
      pwms[i].end();
    }
  });

  it('pwm with push-pull3v', async function() {
    const pwm = obnizA.getFreePwm();
    pwm.start({ io: 0, drive: '3v' });
    pwm.freq(100);
    pwm.duty(50);

    await obnizA.pingWait();
    await detectPulse(0, [40, 60]);

    pwm.end();
  });

  it('pwm with open-drain', async function() {
    const pwm = obnizA.getFreePwm();
    pwm.start({ io: 0, drive: 'open-drain', pull: '5v' });
    pwm.freq(100);
    pwm.duty(50);

    await obnizA.pingWait();
    await detectPulse(0, [40, 60]);

    pwm.end();
  });

  it('pwm with open-drain(no pullup)', async function() {
    const pwm = obnizA.getFreePwm();
    pwm.start({ io: 0, drive: 'open-drain' });
    pwm.freq(1000);
    pwm.duty(99);

    await obnizA.pingWait();
    let valB = await obnizB.getIO(0).inputWait();
    expect(valB).to.be.equal(false);
    valB = await obnizB.getIO(0).inputWait();
    expect(valB).to.be.equal(false);
    valB = await obnizB.getIO(0).inputWait();
    expect(valB).to.be.equal(false);

    pwm.end();
  });
});

function detectPulse(io, ratioRange) {
  return new Promise((resolve, reject) => {
    let ignores = 0;
    obnizB.logicAnalyzer.start({ io, interval: 0.3, duration: 100 });
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
