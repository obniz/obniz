const chai = require('chai');
const expect = chai.expect;
const config = require('../config.js');

let esp32, check_io;

describe('3-pwm', function() {
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

  let pwms = new Array(6);

  it('10%', async function() {
    const pwm = esp32.getFreePwm();
    pwm.start({ io: check_io[0].esp32_io }); // start pwm. output at io0
    pwm.freq(100);
    pwm.duty(10);
    await esp32.pingWait();
    await detectPulse(check_io[0], [0, 20]);
    pwm.end();
  });

  it('50%', async function() {
    const pwm = esp32.getFreePwm();
    pwm.start({ io: check_io[0].esp32_io }); // start pwm. output at io0
    pwm.freq(100);
    pwm.duty(50);
    await esp32.pingWait();
    await detectPulse(check_io[0], [40, 60]);
    pwm.end();
  });

  it('90%', async function() {
    const pwm = esp32.getFreePwm();
    pwm.start({ io: check_io[0].esp32_io }); // start pwm. output at io0
    pwm.freq(100);
    pwm.duty(90);
    await esp32.pingWait();
    await detectPulse(check_io[0], [80, 100]);
    pwm.end();
  });

  it('six pwm', async function() {
    for (let i = 0; i < 6; i++) {
      let pwm = esp32.getFreePwm();
      pwm.start({ io: check_io[i].esp32_io }); // start pwm. output at io0
      pwm.freq(100 * (i + 1));
      pwm.duty(30 + i * 10);
      pwms[i] = pwm;
    }
    await esp32.pingWait();
  });

  it('pwm0 = duty 30', async function() {
    await detectPulse(check_io[0], [20, 40]);
  });

  it('pwm1 = duty 40', async function() {
    await detectPulse(check_io[1], [30, 50]);
  });

  it('pwm2 = duty 50', async function() {
    await detectPulse(check_io[2], [40, 60]);
  });

  it('pwm3 = duty 60', async function() {
    await detectPulse(check_io[3], [50, 70]);
  });

  //todo:bug:get duty 50 However, the waveform looks good...?
  it.skip('pwm4 = duty 70', async function() {
    await detectPulse(check_io[4], [60, 80]);
  });

  it('pwm5 = duty 80', async function() {
    await detectPulse(check_io[5], [70, 90]);
  });

  it('terminate successfull', async function() {
    for (let i = 0; i < pwms.length; i++) {
      pwms[i].end();
    }
  });

  it('pwm with push-pull3v', async function() {
    const pwm = esp32.getFreePwm();
    pwm.start({ io: check_io[0].esp32_io, drive: '3v' });
    pwm.freq(100);
    pwm.duty(50);

    await esp32.pingWait();
    await detectPulse(check_io[0], [40, 60]);

    pwm.end();
  });
  //todo: esp32 5v not supported
  // it('pwm with open-drain', async function () {
  //   const pwm = esp32.getFreePwm();
  //   pwm.start({ io: check_io[0].esp32_io, drive: 'open-drain', pull: '5v' });
  //   pwm.freq(100);
  //   pwm.duty(50);

  //   await esp32.pingWait();
  //   await detectPulse(check_io[0], [40, 60]);

  //   pwm.end();
  // });

  it('pwm with open-drain(no pullup)', async function() {
    const pwm = esp32.getFreePwm();
    pwm.start({ io: check_io[0].esp32_io, drive: 'open-drain' });
    pwm.freq(1000);
    pwm.duty(99);

    await esp32.pingWait();
    let obniz = config.getDevice(check_io[0].obniz);
    let valB = await obniz.getIO(check_io[0].obniz_io).inputWait();
    expect(valB).to.be.equal(false);
    valB = await obniz.getIO(check_io[0].obniz_io).inputWait();
    expect(valB).to.be.equal(false);
    valB = await obniz.getIO(check_io[0].obniz_io).inputWait();
    expect(valB).to.be.equal(false);

    pwm.end();
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
