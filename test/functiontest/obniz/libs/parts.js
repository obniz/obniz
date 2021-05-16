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

  it('wired', function () {
    expect(() => {
      this.obniz.wired('LED', { anode: 0, cathode: 1 });
    }).to.not.throw();
  });

  it('wired-unknown-parts', function () {
    expect(() => {
      this.obniz.wired('led', { anode: 0, cathode: 1 });
    }).to.throw('unknown parts [led]');
  });

  it('wired-before-connection', async function () {
    // reset and create offline obniz
    await testUtil.releaseObnizPromise(this);
    await testUtil.setupNotConnectedYetObnizPromise(this);

    expect(() => {
      this.obniz.wired('DCMotor', { forward: 0, back: 1 });
    }).to.throw('obniz.wired can only be used after connection');
  });
});
