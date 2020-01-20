let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');

let testUtil = require('../testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('obniz', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done);
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('message', function() {
    let targets = ['1234-1231', '1234-1230'];

    this.obniz.message(targets, 'pressed');

    expect(this.obniz).send([
      {
        message: {
          data: 'pressed',
          to: ['1234-1231', '1234-1230'],
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('message receive', function() {
    this.obniz.onmessage = sinon.stub();

    testUtil.receiveJson(this.obniz, [
      {
        message: {
          data: 'button pressed',
          from: '1234-5678',
        },
      },
    ]);

    expect(this.obniz.onmessage.callCount).to.be.equal(1);
    expect(this.obniz.onmessage.getCall(0).args.length).to.be.equal(2);
    expect(this.obniz.onmessage.getCall(0).args[0]).to.be.equal(
      'button pressed'
    );
    expect(this.obniz.onmessage.getCall(0).args[1]).to.be.equal('1234-5678');
  });

  it('message receive2', function() {
    this.obniz.onmessage = sinon.stub();

    testUtil.receiveJson(this.obniz, [
      {
        message: {
          data: [1, 2, 3, 4, 5, 10],
          from: null,
        },
      },
    ]);

    expect(this.obniz.onmessage.callCount).to.be.equal(1);
    expect(this.obniz.onmessage.getCall(0).args.length).to.be.equal(2);
    expect(this.obniz.onmessage.getCall(0).args[0]).to.be.deep.equal([
      1,
      2,
      3,
      4,
      5,
      10,
    ]);
    expect(this.obniz.onmessage.getCall(0).args[1]).to.be.equal(null);
  });

  it('resetOnDisconnect', function() {
    this.obniz.resetOnDisconnect(false);
    expect(this.obniz).send([
      { ws: { reset_obniz_on_ws_disconnection: false } },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('ready', function() {
    this.obniz.onconnect = sinon.stub();
    testUtil.receiveJson(this.obniz, [
      { ws: { ready: true, obniz: { firmware: '1.0.3' } } },
    ]);

    expect(this.obniz.onconnect.callCount).to.be.equal(1);
    expect(this.obniz.onconnect.getCall(0).args.length).to.be.equal(1);
    expect(this.obniz.onconnect.getCall(0).args[0]).to.be.equal(this.obniz);

    expect(this.obniz).send([
      { ws: { reset_obniz_on_ws_disconnection: true } },
    ]);

    expect(this.obniz).to.be.finished;
  });

  it('warning', function() {
    this.obniz.warning = sinon.stub();
    testUtil.receiveJson(this.obniz, [
      {
        debug: {
          warning: {
            message: 'unknown command',
          },
        },
      },
    ]);

    expect(this.obniz.warning.callCount).to.be.equal(1);
    expect(this.obniz.warning.getCall(0).args.length).to.be.equal(1);
    expect(this.obniz.warning.getCall(0).args[0]).to.be.deep.equal({
      alert: 'warning',
      message: 'Warning: unknown command',
    });

    expect(this.obniz).to.be.finished;
  });

  it('error', function() {
    let error = this.obniz.error;
    this.obniz.error = sinon.stub();
    testUtil.receiveJson(this.obniz, [
      {
        debug: {
          error: {
            message: 'voltage down',
          },
        },
      },
    ]);

    expect(this.obniz.error.callCount).to.be.equal(1);
    expect(this.obniz.error.getCall(0).args.length).to.be.equal(1);
    expect(this.obniz.error.getCall(0).args[0]).to.be.deep.equal({
      alert: 'error',
      message: 'Error: voltage down',
    });
    this.obniz.error = error;

    expect(this.obniz).to.be.finished;
  });

  it('unknown part', function() {
    expect(() => {
      this.obniz.wired('unknown parts', { anode: 0, cathode: 1 });
    }).throws;

    expect(this.obniz).to.be.finished;
  });

  it('free i2c', function() {
    let i2c = this.obniz.getFreeI2C();
    expect(i2c).to.be.equal(this.obniz.i2c0);

    expect(this.obniz.getFreeI2C).throws;
    i2c.end();

    let i2c2 = this.obniz.getFreeI2C();
    expect(i2c2).to.be.equal(this.obniz.i2c0);
  });

  it('free pwm', function() {
    let pwm0 = this.obniz.getFreePwm();
    expect(pwm0).to.be.equal(this.obniz.pwm0);

    let pwm1 = this.obniz.getFreePwm();
    expect(pwm1).to.be.equal(this.obniz.pwm1);

    let pwm2 = this.obniz.getFreePwm();
    expect(pwm2).to.be.equal(this.obniz.pwm2);

    let pwm3 = this.obniz.getFreePwm();
    expect(pwm3).to.be.equal(this.obniz.pwm3);

    let pwm4 = this.obniz.getFreePwm();
    expect(pwm4).to.be.equal(this.obniz.pwm4);

    let pwm5 = this.obniz.getFreePwm();
    expect(pwm5).to.be.equal(this.obniz.pwm5);

    expect(this.obniz.getFreePwm).throws;
    pwm4.end();

    let pwm6 = this.obniz.getFreePwm();
    expect(pwm6).to.be.equal(this.obniz.pwm4);
  });

  it('free spi', function() {
    let spi0 = this.obniz.getFreeSpi();
    expect(spi0).to.be.equal(this.obniz.spi0);

    let spi1 = this.obniz.getFreeSpi();
    expect(spi1).to.be.equal(this.obniz.spi1);

    expect(this.obniz.getFreeSpi).throws;
    spi1.end();

    let spi2 = this.obniz.getFreeSpi();
    expect(spi2).to.be.equal(this.obniz.spi1);
  });

  it('free Uart', function() {
    let uart0 = this.obniz.getFreeUart();
    expect(uart0).to.be.equal(this.obniz.uart0);

    let uart1 = this.obniz.getFreeUart();
    expect(uart1).to.be.equal(this.obniz.uart1);

    expect(this.obniz.getFreeUart).throws;
    uart0.end();

    let uart = this.obniz.getFreeUart();
    expect(uart).to.be.equal(this.obniz.uart0);
  });
});
