const chai = require('chai');
const expect = chai.expect;

const testUtil = require('../../../testUtil.js');

describe('ble.hci', function () {
  beforeEach(async function () {
    await testUtil.setupObnizWait(this, null, { binary: true });
  });

  afterEach(async function () {
    await testUtil.releaseObnizWait(this);
  });

  it('send', function () {
    const sendBinaryString = [
      '04 00 0d 00 00 01 00 00 25 80 01 07 00 00 00 00',
    ];
    const binaryArray = sendBinaryString
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    const requestJson = [{ ble: { hci: { write: binaryArray } } }];
    const expecteBinaryStrings = [
      'b 2b 10 04 00 0d 00 00 01 00 00 25 80 01 07 00 00 00 00',
    ];
    testUtil.checkJsonToBinary(requestJson, expecteBinaryStrings, this);
  });

  it('read', function () {
    const recvBinaryString = '04 00 0d 00 00 01 00 00 25 80 01 07 00 00 00 00';
    const recvBinary = recvBinaryString.split(' ').map(function (val, index) {
      return parseInt(val, 16);
    });

    const responseBinaryString =
      'b 2c 10 04 00 0d 00 00 01 00 00 25 80 01 07 00 00 00 00';
    const expectJson = [{ ble: { hci: { read: { data: recvBinary } } } }];

    const binaryArray = responseBinaryString
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    const binary = new Uint8Array(binaryArray);

    const json = this.obniz._binary2Json(binary);

    const isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });
});
