let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');

let testUtil = require('../../../../testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('ble-security', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done, { __firmware_ver: '3.0.0' });
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('write', function() {
    this.obniz.ble.hci.write([0, 1, 2, 3, 4, 5, 22, 1]);

    expect(this.obniz).send([
      { ble: { hci: { write: [0, 1, 2, 3, 4, 5, 22, 1] } } },
    ]);
    expect(this.obniz).to.be.finished;
  });

  it('read', function() {
    let stub = sinon.stub();

    this.obniz.ble.hci.onread = stub;

    let results = [
      { ble: { hci: { read: { data: [0, 1, 2, 3, 4, 5, 22, 1] } } } },
    ];
    testUtil.receiveJson(this.obniz, results);

    sinon.assert.callCount(stub, 1);
    let data = stub.getCall(0).args[0];
    expect(Array.isArray(data)).to.be.true;

    expect(data).to.be.deep.equal([0, 1, 2, 3, 4, 5, 22, 1]);
    expect(this.obniz).to.be.finished;
  });
});
