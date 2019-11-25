let chai = require('chai');
let expect = chai.expect;
let sinon = require('sinon');

let testUtil = require('../../../../testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('ble-hci-central', function() {
  beforeEach(function(done) {
    return testUtil.setupObnizPromise(this, done, { __firmware_ver: '3.0.0' });
  });

  afterEach(function(done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('init', function() {
    this.obniz.ble.init();

    let commands = [
      [0x01, 0x01, 0x0c, 0x08, 0xff, 0xff, 0xfb, 0xff, 0x07, 0xf8, 0xbf, 0x3d], //setEventMask
      [0x01, 0x01, 0x20, 0x08, 0x1f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00], //setLeEventMask
      [0x01, 0x01, 0x10, 0x00], //readLocalVersion
      [0x01, 0x6d, 0x0c, 0x02, 0x01, 0x00], //writeLeHostSupported
      [0x01, 0x6c, 0x0c, 0x00], //readLeHostSupported
      [0x01, 0x09, 0x10, 0x00], //readBdAddr
    ];

    for (let command of commands) {
      expect(this.obniz).send([
        {
          ble: {
            hci: {
              write: command,
            },
          },
        },
      ]);
    }

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
