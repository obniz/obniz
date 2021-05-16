const chai = require('chai');
const expect = chai.expect;

const testUtil = require('../../testUtil.js');

describe('obniz.libs.system', function () {
  beforeEach(async function () {
    await testUtil.setupObnizPromise(this);
  });

  afterEach(async function () {
    await testUtil.releaseObnizPromise(this);
  });

  it('ping', function () {
    const unixtime = 1522840296917;
    const rand = 4553670;
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

  it('pingPong', function () {
    const unixtime = 1522840296917;
    const rand = 4553670;
    let resolved = false;
    const promise = this.obniz.pingWait(unixtime, rand).then(() => {
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

  it('keepWrokingAtOffline', function () {
    this.obniz.keepWorkingAtOffline(true);
    expect(this.obniz).send([{ system: { keep_working_at_offline: true } }]);
    expect(this.obniz).to.be.finished;
  });

  it('reboot', function () {
    this.obniz.reboot(true);
    expect(this.obniz).send([{ system: { reboot: true } }]);
    expect(this.obniz).to.be.finished;
  });

  it('reset', function () {
    this.obniz.reset(true);
    expect(this.obniz).send([{ system: { reset: true } }]);
    expect(this.obniz).to.be.finished;
  });

  it('selfCheck', function () {
    this.obniz.selfCheck(true);
    expect(this.obniz).send([{ system: { self_check: true } }]);
    expect(this.obniz).to.be.finished;
  });

  it('wait', function () {
    this.obniz.wait(500);
    expect(this.obniz).send([{ system: { wait: 500 } }]);
    expect(this.obniz).to.be.finished;
  });

  it('wait delay', function () {
    function wait(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(reject, ms);
      });
    }
    const promise = Promise.race([this.obniz.wait(500), wait(501)]);
    expect(this.obniz).send([{ system: { wait: 500 } }]);
    expect(this.obniz).to.be.finished;
    return promise;
  });

  it('wait delay2', function () {
    function wait(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
      });
    }
    const promise = Promise.race([
      this.obniz.wait(500).then(() => {
        return Promise.reject('too early');
      }),
      wait(495),
    ]);
    expect(this.obniz).send([{ system: { wait: 500 } }]);
    expect(this.obniz).to.be.finished;
    return promise;
  });

  it('sleep', function () {
    const date = new Date();
    date.setHours(date.getHours() + 1, 0, 0, 0);
    const now = new Date();
    this.obniz.sleep(date);
    expect(this.obniz).send([
      { system: { sleep_seconds: Math.floor((date - now) / 1000) } },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('sleep2', function () {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    const now = new Date();
    this.obniz.sleep(date);
    expect(this.obniz).send([
      { system: { sleep_minute: Math.floor((date - now) / 1000 / 60) } },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('sleepSeconds', function () {
    this.obniz.sleepSeconds(300);
    expect(this.obniz).send([{ system: { sleep_seconds: 300 } }]);
    expect(this.obniz).to.be.finished;
  });

  it('sleepMinute', function () {
    this.obniz.sleepMinute(5);
    expect(this.obniz).send([{ system: { sleep_minute: 5 } }]);
    expect(this.obniz).to.be.finished;
  });

  it('sleepIoTrigger', function () {
    this.obniz.sleepIoTrigger(true);
    expect(this.obniz).send([{ system: { sleep_io_trigger: true } }]);
    expect(this.obniz).to.be.finished;
  });

  it('closeAndReconnect', async function () {
    const before = this.obniz.io0;
    before.output(true);
    expect(before.value).to.be.true;
    await testUtil.closeAndReconnectObnizWait(this);
    const after = this.obniz.io0;
    expect(before === after).to.be.true;
    expect(after.value).to.be.false;
  });
});
