const chai = require('chai');
const expect = chai.expect;

const testUtil = require(global.appRoot + '/test/functiontest/testUtil.js');

describe('obniz.libs.pwm', function () {
  beforeEach(async function () {
    await testUtil.setupObnizWait(this);
  });
  afterEach(async function () {
    await testUtil.releaseObnizWait(this);
  });

  it('getpwm', function () {
    const pwm = this.obniz.getFreePwm();

    expect(this.obniz).to.be.finished;
    expect(pwm).to.be.equal(this.obniz.pwm0);
  });

  it('getpwm double', function () {
    const pwm1 = this.obniz.getFreePwm();
    const pwm2 = this.obniz.getFreePwm();

    expect(this.obniz).to.be.finished;
    expect(pwm1).to.be.equal(this.obniz.pwm0);
    expect(pwm2).to.be.equal(this.obniz.pwm1);
  });

  it('getpwm released', function () {
    const pwm1 = this.obniz.getFreePwm();
    expect(pwm1).to.be.equal(this.obniz.pwm0);
    pwm1.start({ io: 11 });
    expect(this.obniz).send([{ io11: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io11: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ pwm0: { io: 11 } }]);

    pwm1.end();
    expect(this.obniz).send([{ pwm0: null }]);

    const pwm2 = this.obniz.getFreePwm();
    expect(pwm2).to.be.equal(this.obniz.pwm0);
    expect(this.obniz).to.be.finished;
  });

  it('start io', function () {
    const pwm = this.obniz.getFreePwm();
    pwm.start({ io: 11 });

    expect(this.obniz).send([{ io11: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io11: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ pwm0: { io: 11 } }]);
    expect(this.obniz).to.be.finished;
    expect(pwm).to.be.equal(this.obniz.pwm0);
  });

  it('start io with drive-pull', function () {
    const pwm = this.obniz.getFreePwm();
    pwm.start({ io: 11, drive: 'open-drain', pull: '5v' });

    expect(this.obniz).send([{ io11: { output_type: 'open-drain' } }]);
    expect(this.obniz).send([{ io11: { pull_type: 'pull-up5v' } }]);
    expect(this.obniz).send([{ pwm0: { io: 11 } }]);
    expect(this.obniz).to.be.finished;
    expect(pwm).to.be.equal(this.obniz.pwm0);
  });

  it('start io invalid', function () {
    const pwm = this.obniz.getFreePwm();

    expect(function () {
      pwm.start({ io: 15 });
    }).throw(Error);

    expect(this.obniz).to.be.finished;
    expect(pwm).to.be.equal(this.obniz.pwm0);
  });

  it('freq', function () {
    const pwm = this.obniz.getFreePwm();
    pwm.start({ io: 10 });
    expect(this.obniz).send([{ io10: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io10: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ pwm0: { io: 10 } }]);
    pwm.freq(1000);
    expect(this.obniz).send([{ pwm0: { freq: 1000 } }]);

    expect(this.obniz).to.be.finished;
    expect(pwm).to.be.equal(this.obniz.pwm0);
  });

  it('pulse', function () {
    const pwm = this.obniz.getFreePwm();
    pwm.start({ io: 9 });
    expect(this.obniz).send([{ io9: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io9: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ pwm0: { io: 9 } }]);
    pwm.freq(500);
    expect(this.obniz).send([{ pwm0: { freq: 500 } }]);
    pwm.pulse(0.5);
    expect(this.obniz).send([{ pwm0: { pulse: 0.5 } }]);

    expect(this.obniz).to.be.finished;
    expect(pwm).to.be.equal(this.obniz.pwm0);
  });

  it('duty', function () {
    const pwm = this.obniz.getFreePwm();
    pwm.start({ io: 9 });
    expect(this.obniz).send([{ io9: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io9: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ pwm0: { io: 9 } }]);
    pwm.freq(500);
    expect(this.obniz).send([{ pwm0: { freq: 500 } }]);
    pwm.duty(0.5);
    expect(this.obniz).send([{ pwm0: { pulse: 0.01 } }]);

    expect(this.obniz).to.be.finished;
    expect(pwm).to.be.equal(this.obniz.pwm0);
  });

  it('modulate', function () {
    const pwm = this.obniz.getFreePwm();
    pwm.start({ io: 11 }); // start pwm. output at io11
    expect(this.obniz).send([{ io11: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io11: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ pwm0: { io: 11 } }]);
    pwm.freq(38000); // set pwm frequency to 38khz
    expect(this.obniz).send([{ pwm0: { freq: 38000 } }]);

    // signal for room heater's remote signal
    const arr = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
    ];

    pwm.modulate('am', 0.07, arr); // am modulate. symbol length = 70usec.

    expect(this.obniz).send([
      { pwm0: { modulate: { data: arr, symbol_length: 0.07, type: 'am' } } },
    ]);
    expect(this.obniz).to.be.finished;
    expect(pwm).to.be.equal(this.obniz.pwm0);
  });

  it('end', function () {
    const pwm = this.obniz.getFreePwm();
    pwm.start({ io: 11 });
    expect(this.obniz).send([{ io11: { output_type: 'push-pull5v' } }]);
    expect(this.obniz).send([{ io11: { pull_type: 'float' } }]);
    expect(this.obniz).send([{ pwm0: { io: 11 } }]);
    pwm.end();
    expect(this.obniz).send([{ pwm0: null }]);
    expect(this.obniz).to.be.finished;
    expect(pwm).to.be.equal(this.obniz.pwm0);
  });
});
