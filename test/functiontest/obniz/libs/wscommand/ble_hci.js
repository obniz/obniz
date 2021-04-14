const chai = require('chai');
let expect = chai.expect;

const testUtil = require('../../../testUtil.js');
chai.use(require('chai-like'));
chai.use(testUtil.obnizAssert);

describe('ble.hci', function () {
  beforeEach(function (done) {
    return testUtil.setupObnizPromise(this, done, { binary: true });
  });

  afterEach(function (done) {
    return testUtil.releaseObnizePromise(this, done);
  });

  it('send', function () {
    let sendBinaryString = ['04 00 0d 00 00 01 00 00 25 80 01 07 00 00 00 00'];
    let binaryArray = sendBinaryString
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    let requestJson = [{ ble: { hci: { write: binaryArray } } }];
    let expecteBinaryStrings = [
      'b 2b 10 04 00 0d 00 00 01 00 00 25 80 01 07 00 00 00 00',
    ];
    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('read', function () {
    let recvBinaryString = '04 00 0d 00 00 01 00 00 25 80 01 07 00 00 00 00';
    let recvBinary = recvBinaryString.split(' ').map(function (val, index) {
      return parseInt(val, 16);
    });

    let responseBinaryString =
      'b 2c 10 04 00 0d 00 00 01 00 00 25 80 01 07 00 00 00 00';
    let expectJson = [{ ble: { hci: { read: { data: recvBinary } } } }];

    let binaryArray = responseBinaryString
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    let binary = new Uint8Array(binaryArray);

    let json = this.obniz._binary2Json(binary);

    let isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });
});
