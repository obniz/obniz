let chai = require('chai');
let expect = chai.expect;

let testUtil = require('../../testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('obniz.libs.system', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done);
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('ping', function() {
    let unixtime = 1522840296917;
    let rand = 4553670;
    this.obniz.pingWait(unixtime, rand);
    expect(this.obniz).send([
      {
        system: {
          ping: { key: [0, 0, 1, 98, 144, 90, 221, 213, 0, 69, 123, 198] },
        },
      },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('pingPong', function() {
    let unixtime = 1522840296917;
    let rand = 4553670;
    let resolved = false;
    let promise = this.obniz.pingWait(unixtime, rand).then(() => {
      resolved = true;
    });
    expect(this.obniz).send([
      {
        system: {
          ping: { key: [0, 0, 1, 98, 144, 90, 221, 213, 0, 69, 123, 198] },
        },
      },
    ]);
    expect(resolved).to.be.false;
    testUtil.receiveJson(this.obniz, [
      {
        system: {
          pong: {
            key: [0, 0, 1, 98, 144, 90, 221, 213, 0, 69, 123, 198],
            obnizTime: 4553670,
            pingServerTime: 1522840296035,
            pongServerTime: 1522840297892,
          },
        },
      },
    ]);

    return promise;
  });

  it('keepWrokingAtOffline', function() {
    this.obniz.keepWorkingAtOffline(true);
    expect(this.obniz).send([{ system: { keep_working_at_offline: true } }]);
    expect(this.obniz).to.be.finished;
  });

  it('reboot', function() {
    this.obniz.reboot(true);
    expect(this.obniz).send([{ system: { reboot: true } }]);
    expect(this.obniz).to.be.finished;
  });

  it('reset', function() {
    this.obniz.reset(true);
    expect(this.obniz).send([{ system: { reset: true } }]);
    expect(this.obniz).to.be.finished;
  });

  it('selfCheck', function() {
    this.obniz.selfCheck(true);
    expect(this.obniz).send([{ system: { self_check: true } }]);
    expect(this.obniz).to.be.finished;
  });

  it('wait', function() {
    this.obniz.wait(500);
    expect(this.obniz).send([{ system: { wait: 500 } }]);
    expect(this.obniz).to.be.finished;
  });

  it('wait delay', function() {
    function wait(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(reject, ms);
      });
    }
    let promise = Promise.race([this.obniz.wait(500), wait(501)]);
    expect(this.obniz).send([{ system: { wait: 500 } }]);
    expect(this.obniz).to.be.finished;
    return promise;
  });

  it('wait delay2', function() {
    function wait(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
      });
    }
    let promise = Promise.race([
      this.obniz.wait(500).then(() => {
        return Promise.reject('too early');
      }),
      wait(495),
    ]);
    expect(this.obniz).send([{ system: { wait: 500 } }]);
    expect(this.obniz).to.be.finished;
    return promise;
  });
});
