const chai = require('chai');
const expect = chai.expect;

const testUtil = require('../../../testUtil.js');

describe('display', function () {
  beforeEach(async function () {
    await testUtil.setupObnizWait(this, null, { binary: true });
  });

  afterEach(async function () {
    await testUtil.releaseObnizWait(this);
  });

  it('request test no.0', function () {
    const requestJson = [{ display: { clear: true } }];
    const expecteBinaryStrings = ['08 00 00'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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
    const requestJson = [{ display: { text: 'Pushing' } }];
    const expecteBinaryStrings = ['08 01 07 50 75 73 68 69 6e 67'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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
    const requestJson = [{ display: { clear: true } }];
    const expecteBinaryStrings = ['08 00 00'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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

  it('response test no.5', function () {
    const responseBinaryString = '09 00 01 03';
    const expectJson = [{ switch: { state: 'right' } }];

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

  it('request test no.6', function () {
    const requestJson = [{ display: { clear: true } }];
    const expecteBinaryStrings = ['08 00 00'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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

  it('qr', function () {
    const requestJson = [
      {
        display: {
          qr: { text: 'https://obniz.io/p/13924942', correction: 'Q' },
        },
      },
    ];
    const binaryArray = [
      8, 3, 68, 0, 255, 255, 255, 255, 255, 255, 255, 252, 0, 0, 0, 0, 0, 0, 0,
      0, 255, 255, 255, 255, 255, 255, 255, 252, 0, 0, 0, 0, 0, 0, 0, 0, 192, 0,
      204, 240, 204, 12, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 192, 0, 204, 240, 204,
      12, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 207, 252, 192, 243, 51, 252, 255, 204,
      0, 0, 0, 0, 0, 0, 0, 0, 207, 252, 192, 243, 51, 252, 255, 204, 0, 0, 0, 0,
      0, 0, 0, 0, 204, 12, 252, 51, 12, 60, 192, 204, 0, 0, 0, 0, 0, 0, 0, 0,
      204, 12, 252, 51, 12, 60, 192, 204, 0, 0, 0, 0, 0, 0, 0, 0, 204, 12, 243,
      51, 243, 204, 192, 204, 0, 0, 0, 0, 0, 0, 0, 0, 204, 12, 243, 51, 243,
      204, 192, 204, 0, 0, 0, 0, 0, 0, 0, 0, 204, 12, 243, 240, 192, 12, 192,
      204, 0, 0, 0, 0, 0, 0, 0, 0, 204, 12, 243, 240, 192, 12, 192, 204, 0, 0,
      0, 0, 0, 0, 0, 0, 207, 252, 255, 255, 243, 252, 255, 204, 0, 0, 0, 0, 0,
      0, 0, 0, 207, 252, 255, 255, 243, 252, 255, 204, 0, 0, 0, 0, 0, 0, 0, 0,
      192, 0, 204, 204, 204, 204, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 192, 0, 204,
      204, 204, 204, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 243, 195, 48, 63,
      255, 252, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 243, 195, 48, 63, 255, 252, 0,
      0, 0, 0, 0, 0, 0, 0, 243, 252, 15, 48, 63, 195, 255, 12, 0, 0, 0, 0, 0, 0,
      0, 0, 243, 252, 15, 48, 63, 195, 255, 12, 0, 0, 0, 0, 0, 0, 0, 0, 192,
      255, 192, 63, 240, 3, 204, 60, 0, 0, 0, 0, 0, 0, 0, 0, 192, 255, 192, 63,
      240, 3, 204, 60, 0, 0, 0, 0, 0, 0, 0, 0, 240, 240, 63, 60, 12, 240, 15,
      252, 0, 0, 0, 0, 0, 0, 0, 0, 240, 240, 63, 60, 12, 240, 15, 252, 0, 0, 0,
      0, 0, 0, 0, 0, 240, 195, 60, 60, 15, 204, 255, 252, 0, 0, 0, 0, 0, 0, 0,
      0, 240, 195, 60, 60, 15, 204, 255, 252, 0, 0, 0, 0, 0, 0, 0, 0, 192, 252,
      243, 195, 15, 0, 243, 60, 0, 0, 0, 0, 0, 0, 0, 0, 192, 252, 243, 195, 15,
      0, 243, 60, 0, 0, 0, 0, 0, 0, 0, 0, 252, 51, 51, 0, 15, 12, 195, 12, 0, 0,
      0, 0, 0, 0, 0, 0, 252, 51, 51, 0, 15, 12, 195, 12, 0, 0, 0, 0, 0, 0, 0, 0,
      240, 252, 204, 255, 252, 195, 63, 252, 0, 0, 0, 0, 0, 0, 0, 0, 240, 252,
      204, 255, 252, 195, 63, 252, 0, 0, 0, 0, 0, 0, 0, 0, 252, 207, 204, 195,
      15, 63, 192, 60, 0, 0, 0, 0, 0, 0, 0, 0, 252, 207, 204, 195, 15, 63, 192,
      60, 0, 0, 0, 0, 0, 0, 0, 0, 252, 12, 192, 51, 252, 3, 48, 204, 0, 0, 0, 0,
      0, 0, 0, 0, 252, 12, 192, 51, 252, 3, 48, 204, 0, 0, 0, 0, 0, 0, 0, 0,
      195, 63, 48, 63, 195, 48, 192, 204, 0, 0, 0, 0, 0, 0, 0, 0, 195, 63, 48,
      63, 195, 48, 192, 204, 0, 0, 0, 0, 0, 0, 0, 0, 195, 12, 204, 0, 204, 63,
      255, 204, 0, 0, 0, 0, 0, 0, 0, 0, 195, 12, 204, 0, 204, 63, 255, 204, 0,
      0, 0, 0, 0, 0, 0, 0, 207, 195, 15, 63, 12, 240, 207, 12, 0, 0, 0, 0, 0, 0,
      0, 0, 207, 195, 15, 63, 12, 240, 207, 12, 0, 0, 0, 0, 0, 0, 0, 0, 204, 60,
      204, 48, 240, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 204, 60, 204, 48, 240, 0,
      0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 207, 48, 48, 207, 192, 252, 0, 0,
      0, 0, 0, 0, 0, 0, 255, 255, 207, 48, 48, 207, 192, 252, 0, 0, 0, 0, 0, 0,
      0, 0, 192, 0, 204, 252, 3, 12, 207, 60, 0, 0, 0, 0, 0, 0, 0, 0, 192, 0,
      204, 252, 3, 12, 207, 60, 0, 0, 0, 0, 0, 0, 0, 0, 207, 252, 240, 51, 240,
      15, 195, 12, 0, 0, 0, 0, 0, 0, 0, 0, 207, 252, 240, 51, 240, 15, 195, 12,
      0, 0, 0, 0, 0, 0, 0, 0, 204, 12, 255, 255, 243, 0, 15, 252, 0, 0, 0, 0, 0,
      0, 0, 0, 204, 12, 255, 255, 243, 0, 15, 252, 0, 0, 0, 0, 0, 0, 0, 0, 204,
      12, 243, 48, 240, 15, 63, 60, 0, 0, 0, 0, 0, 0, 0, 0, 204, 12, 243, 48,
      240, 15, 63, 60, 0, 0, 0, 0, 0, 0, 0, 0, 204, 12, 243, 63, 3, 0, 3, 60, 0,
      0, 0, 0, 0, 0, 0, 0, 204, 12, 243, 63, 3, 0, 3, 60, 0, 0, 0, 0, 0, 0, 0,
      0, 207, 252, 204, 0, 204, 48, 204, 204, 0, 0, 0, 0, 0, 0, 0, 0, 207, 252,
      204, 0, 204, 48, 204, 204, 0, 0, 0, 0, 0, 0, 0, 0, 192, 0, 255, 255, 51,
      243, 192, 252, 0, 0, 0, 0, 0, 0, 0, 0, 192, 0, 255, 255, 51, 243, 192,
      252, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 252, 0, 0,
      0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255, 252, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

    const binary = new Uint8Array(binaryArray);

    expect(compress).to.be.deep.equal(binary);
  });

  it('request test no.8', function () {
    const requestJson = [{ display: { clear: true } }];
    const expecteBinaryStrings = ['08 00 00'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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
    const requestJson = [{ display: { clear: true } }];
    const expecteBinaryStrings = ['08 00 00'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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

  it('request test no.12', function () {
    const requestJson = [{ display: { clear: true } }];
    const expecteBinaryStrings = ['08 00 00'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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

  it('request test no.14', function () {
    const requestJson = [{ display: { text: 'Pushing' } }];
    const expecteBinaryStrings = ['08 01 07 50 75 73 68 69 6e 67'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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

  it('request test no.16', function () {
    const requestJson = [{ display: { clear: true } }];
    const expecteBinaryStrings = ['08 00 00'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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

  it('request test no.17', function () {
    const requestJson = [{ display: { clear: true } }];
    const expecteBinaryStrings = ['08 00 00'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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

  it('request test no.21', function () {
    const requestJson = [{ display: { clear: true } }];
    const expecteBinaryStrings = ['08 00 00'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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

  it('request test no.23', function () {
    const requestJson = [
      {
        display: {
          raw: [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 96, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0,
            0, 240, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 240, 0, 0, 0,
            0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 1, 152, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 1, 152, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 12, 12, 0, 192, 248,
            6, 60, 6, 6, 120, 0, 0, 0, 0, 0, 3, 12, 12, 0, 195, 254, 6, 254, 6,
            6, 248, 0, 0, 0, 0, 0, 6, 6, 6, 1, 135, 7, 7, 135, 6, 7, 128, 0, 0,
            0, 0, 0, 6, 6, 6, 1, 140, 3, 7, 3, 134, 7, 0, 0, 0, 0, 0, 0, 12, 7,
            3, 3, 12, 1, 135, 1, 134, 7, 0, 0, 0, 0, 0, 0, 12, 3, 3, 3, 24, 1,
            134, 1, 134, 6, 0, 0, 0, 0, 0, 0, 12, 3, 3, 3, 31, 255, 134, 1, 134,
            6, 0, 0, 0, 0, 0, 0, 31, 255, 129, 134, 31, 255, 134, 1, 134, 6, 0,
            0, 0, 0, 0, 0, 31, 255, 129, 134, 24, 0, 6, 1, 134, 6, 0, 0, 0, 0,
            0, 0, 48, 0, 192, 204, 24, 0, 6, 1, 134, 6, 0, 0, 0, 0, 0, 0, 48, 0,
            192, 204, 12, 0, 6, 1, 134, 6, 0, 0, 0, 0, 0, 0, 96, 0, 96, 204, 14,
            1, 6, 1, 134, 6, 0, 0, 0, 0, 0, 0, 96, 0, 96, 120, 7, 3, 134, 1,
            134, 6, 0, 0, 0, 0, 0, 0, 96, 0, 96, 120, 3, 255, 6, 1, 134, 6, 0,
            0, 0, 0, 0, 0, 192, 0, 48, 48, 0, 252, 6, 1, 134, 6, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          ],
        },
      },
    ];
    const expecteBinaryStrings = [
      '8 3 44 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 60 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 60 0 0 0 0 0 0 6 0 0 0 0 0 0 0 0 f0 0 0 0 0 0 0 6 0 0 0 0 0 0 0 0 f0 0 0 0 0 0 0 6 0 0 0 0 0 0 0 1 98 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 98 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 8 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3 c c 0 c0 f8 6 3c 6 6 78 0 0 0 0 0 3 c c 0 c3 fe 6 fe 6 6 f8 0 0 0 0 0 6 6 6 1 87 7 7 87 6 7 80 0 0 0 0 0 6 6 6 1 8c 3 7 3 86 7 0 0 0 0 0 0 c 7 3 3 c 1 87 1 86 7 0 0 0 0 0 0 c 3 3 3 18 1 86 1 86 6 0 0 0 0 0 0 c 3 3 3 1f ff 86 1 86 6 0 0 0 0 0 0 1f ff 81 86 1f ff 86 1 86 6 0 0 0 0 0 0 1f ff 81 86 18 0 6 1 86 6 0 0 0 0 0 0 30 0 c0 cc 18 0 6 1 86 6 0 0 0 0 0 0 30 0 c0 cc c 0 6 1 86 6 0 0 0 0 0 0 60 0 60 cc e 1 6 1 86 6 0 0 0 0 0 0 60 0 60 78 7 3 86 1 86 6 0 0 0 0 0 0 60 0 60 78 3 ff 6 1 86 6 0 0 0 0 0 0 c0 0 30 30 0 fc 6 1 86 6 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0',
    ];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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

  it('pin name', function () {
    const requestJson = [
      {
        display: {
          pin_assign: {
            0: {
              module_name: 'io',
              pin_name: 'output',
            },
          },
        },
      },
    ];
    const expecteBinaryStrings = ['8 5 0a 0 69 6F 20 6F 75 74 70 75 74'];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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

  it('pin name2', function () {
    const requestJson = [
      {
        display: {
          pin_assign: {
            0: {
              module_name: 'io',
              pin_name: 'output',
            },
            8: {
              module_name: 'pwm',
            },
            10: {
              pin_name: 'input',
            },
          },
        },
      },
    ];
    const expecteBinaryStrings = [
      '8 5 0a 0 69 6f 20 6f 75 74 70 75 74 8 5 6 8 70 77 6D 20 3F 8 5 8 a 3f 20 69 6E 70 75 74',
    ];

    expect(requestJson.length).to.be.equal(1);

    const isValidCommand = testUtil.isValidCommandRequestJson(requestJson);
    expect(isValidCommand.valid).to.be.true;

    const compress = this.obniz.constructor.WSCommand.compress(
      this.obniz.wscommands,
      requestJson[0]
    );

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
