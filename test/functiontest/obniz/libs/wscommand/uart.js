const chai = require('chai');
const expect = chai.expect;

const testUtil = require(global.appRoot + '/test/functiontest/testUtil.js');

describe('uart.log', function () {
  beforeEach(async function () {
    await testUtil.setupObnizWait(this, null, { binary: true });
  });

  afterEach(async function () {
    await testUtil.releaseObnizWait(this);
  });

  it('request test no.0', function () {
    const requestJson = [{ uart0: { tx: 0, rx: 1, baud: 9600, bits: 7 } }];
    const expecteBinaryStrings = [
      '04 00 0d 00 00 01 00 00 25 80 01 07 00 00 00 00',
    ];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('request test no.1', function () {
    const requestJson = [{ uart0: null }];
    const expecteBinaryStrings = ['04 01 01 00'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('request test no.2', function () {
    const requestJson = [{ uart1: { tx: 0, rx: 1 } }];
    const expecteBinaryStrings = [
      '04 00 0d 01 00 01 00 01 C2 00 01 08 00 00 00 00',
    ];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('request test no.3', function () {
    const requestJson = [{ uart1: { data: [17] } }];
    const expecteBinaryStrings = ['04 02 02 01 11'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('request test no.4', function () {
    const requestJson = [{ uart1: { data: [17, 69, 68] } }];
    const expecteBinaryStrings = ['04 02 04 01 11 45 44'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('request test no.5', function () {
    const requestJson = [{ uart0: { tx: 2, rx: 3 } }];
    const expecteBinaryStrings = [
      '04 00 0d 00 02 03 00 01 C2 00 01 08 00 00 00 00',
    ];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('response test no.6', function () {
    const responseBinaryString = '04 03 0b 01 00 69 61 73 64 66 61 73 64 66';
    const expectJson = [
      { uart1: { data: [0, 105, 97, 115, 100, 102, 97, 115, 100, 102] } },
    ];

    const binaryArray = responseBinaryString
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    const binary = new Uint8Array(binaryArray);

    const json = this.obniz.wsCommandManager.binary2Json(binary);

    const isValidCommand = testUtil.isValidCommandResponseJson(json);
    expect(isValidCommand.valid).to.be.true;

    expect(json).to.be.deep.equal(expectJson);
  });

  it('request test no.7', function () {
    const requestJson = [
      {
        uart0: {
          tx: 0,
          rx: 1,
          baud: 115200,
          stop: 1.5,
          bits: 7,
          parity: 'odd',
          flowcontrol: 'rts',
          rts: 10,
        },
      },
    ];
    const expecteBinaryStrings = [
      '04 00 0d 00 00 01 00 01 c2 00 02 07 03 02 0a 00',
    ];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('request test no.8', function () {
    const requestJson = [
      {
        uart1: {
          tx: 2,
          rx: 3,
          baud: 115200,
          stop: 1.5,
          bits: 7,
          parity: 'odd',
          flowcontrol: 'rts',
          rts: 11,
        },
      },
    ];
    const expecteBinaryStrings = [
      '04 00 0d 01 02 03 00 01 c2 00 02 07 03 02 0b 00',
    ];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('request test no.9', function () {
    const requestJson = [{ uart0: null }];
    const expecteBinaryStrings = ['04 01 01 00'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('request test no.10', function () {
    const requestJson = [{ uart1: null }];
    const expecteBinaryStrings = ['04 01 01 01'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.wsCommandManager.compress(requestJson[0]);

    const binaryArray = expecteBinaryStrings
      .join(' ')
      .split(' ')
      .map(function (val, index) {
        return parseInt(val, 16);
      });
    expect(binaryArray.length).to.be.above(2);
    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });
});
